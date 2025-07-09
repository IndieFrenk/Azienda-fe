# Azienda Frontend

Un'applicazione web Angular per la gestione aziendale con sistema di autenticazione e feedback.

## Tecnologie Utilizzate

- **Angular** - Framework frontend
- **TypeScript** - Linguaggio di programmazione
- **JavaScript** - Linguaggio di supporto
- **NPM** - Package manager
- **Angular Material** - UI components (con date adapter personalizzato)

## Struttura del Progetto
src/ ├── app/ │ 
     ├── _models/ # Modelli di dati │ 
     ├── _services/ # Servizi per API e business logic │ 
     ├── admin/ # Componenti amministrazione │ 
     ├── auth/ # Gestione autenticazione │ 
     ├── feedback/ # Sistema feedback │ 
     ├── user/ # Gestione utenti │ 
     └── shared/ # Componenti condivisi 
          ├── assets/ # Risorse statiche 
          └── public/ # Immagini e risorse pubbliche

## Funzionalità di Sicurezza
Interceptor per gestione automatica token
Guard per protezione route
Gestione sicura dello storage
Validazione form con Angular Reactive Forms

##  Responsive Design
L'applicazione è ottimizzata per diversi dispositivi con un design responsive.

## Funzionalità Principali

### Autenticazione
- Login e registrazione utenti
- Recupero password
- Cambio password
- Refresh token automatico
- Guard per protezione route

### Gestione Utenti
- Visualizzazione lista utenti
- Dettagli utente
- Ricerca utenti
- Pagina profilo personale

### Sistema Feedback
- Invio feedback
- Visualizzazione lista feedback
- Dettagli feedback
- Gestione risposte

### Amministrazione
- Pannello admin
- Gestione utenti e permessi

## Servizi Backend

L'applicazione si connette a un server backend su `http://localhost:7777` con i seguenti endpoint:

- `/auth/login` - Login utente
- `/auth/signup` - Registrazione
- `/auth/signout` - Logout
- `/auth/refreshtoken` - Refresh token
- `/auth/changePass` - Cambio password
- `/auth/recoverPass` - Recupero password

## Installazione

1. Clona il repository
2. Installa le dipendenze:
   ```bash
   npm install
   ng serve
   ## L'applicazione sarà disponibile su http://localhost:4200
   
   
