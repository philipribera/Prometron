import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Firebase {
    constructor() {
        this.uid = null;
        app.initializeApp(config);
        
        this.emailAuthProvider = app.auth.EmailAuthProvider;
        this.auth = app.auth();
        this.db = app.database();
        this.serverValue = app.database.ServerValue;

        
        this.googleProvider = new app.auth.GoogleAuthProvider();
        this.facebookProvider = new app.auth.FacebookAuthProvider();
    }
    
    // *** Auth API ***
    
    doSendEmailVerification = () =>
    this.auth.currentUser.sendEmailVerification({
        url: process.env.REACT_APP_CONFIRMATION_EMAIL_REDIRECT,
    });
    
    doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);
    
    doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);
    
    doSignInWithGoogle = () =>
    this.auth.signInWithPopup(this.googleProvider);
    
    doSignInWithFacebook = () =>
    this.auth.signInWithPopup(this.facebookProvider);
    
    doSignOut = () => this.auth.signOut();
    
    doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
    doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);
    
    // *** Merge Auth and DB User API *** //
    onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
        if (authUser) {

            // presence checker
            this.connectedRef().on('value', snapshot => {
                if (snapshot.val()) {
                    this.presenceRef(this.auth.currentUser.uid).onDisconnect().remove();
                    this.presenceRef(this.auth.currentUser.uid).set(true);
                };
            });
            
            this.user(authUser.uid)
                .once('value')
                .then(snapshot => {
                    const dbUser = snapshot.val();
                    // default empty roles
                    if (!dbUser.roles) {
                        dbUser.roles = [];
                        }
                        // merge auth and db user
                        authUser = {
                            uid: authUser.uid,
                            email: authUser.email,
                            emailVerified: authUser.emailVerified,
                            providerData: authUser.providerData,
                            ...dbUser,
                        };
                        next(authUser);
                    });
            } else {
                fallback();
            };
        });

    
    // *** User API ***
    
    user = uid => this.db.ref(`users/${uid}`);
    users = () => this.db.ref('users');

    // *** Presence API ***

    connectedRef = () => this.db.ref('.info/connected');
    presencesRef = () => this.db.ref(`presence`);
    presenceRef = uid => this.db.ref(`presence/${uid}`);

    // ***Message API ***

    message = uid => this.db.ref(`messages/${uid}`);
    messages = () => this.db.ref('messages');

    // *** Game API ***

    game = uid => this.db.ref(`game/${uid}`);
    games = () => this.db.ref('games');

};

export default Firebase;