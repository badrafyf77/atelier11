# Atelier 11 – Jenkins CI/CD – Calculatrice Node.js

## Mac M1 (Apple Silicon) – Guide complet

---

## Structure du projet

```
atelier11/
├── index.js          ← Logique calculatrice (add, subtract, multiply, divide)
├── server.js         ← Serveur Express (indépendant d'index.js)
├── package.json
├── Jenkinsfile
├── .gitignore
├── public/
│   └── index.html    ← Interface web
└── test/
    └── app.test.js   ← Tests Jest + Supertest
```

---

## Partie 1 – Installation de Jenkins sur Mac M1

### 1.1 Prérequis

```bash
# Vérifier Java (JDK 17+)
java -version

# Installer si absent (via Homebrew)
brew install openjdk@17
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### 1.2 Installer Jenkins via Homebrew

```bash
brew install jenkins-lts
```

### 1.3 Démarrer Jenkins

```bash
# Démarrer Jenkins comme service
brew services start jenkins-lts

# OU lancer manuellement
jenkins-lts
```

Jenkins sera accessible sur **http://localhost:8080**

> Sur Mac le port par défaut est déjà 8080.  
> Sur Windows c'est `net start Jenkins` – sur Mac on utilise Homebrew services.

### 1.4 Mot de passe initial

```bash
cat ~/.jenkins/secrets/initialAdminPassword
```

Copier ce mot de passe et le coller dans http://localhost:8080.

### 1.5 Premier démarrage

1. Coller le mot de passe initial
2. Cliquer **"Installer les plugins suggérés"**
3. Créer l'utilisateur Admin (ex: admin / admin)
4. Laisser l'URL par défaut → **Save and Finish**

---

## Partie 2 – Installer Node.js dans Jenkins

1. **Manage Jenkins** → **Manage Plugins** → onglet "Available plugins"
2. Chercher **NodeJS** → cocher → **Install without restart**
3. **Manage Jenkins** → **Global Tool Configuration** → **NodeJS installations**
4. Cliquer **Add NodeJS** :
   - Name : `NodeJS` ← doit correspondre au Jenkinsfile
   - Version : choisir la LTS (ex : 20.x)
   - Cocher "Install automatically"
5. **Save**

---

## Partie 3 – Créer un Personal Access Token GitHub

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. **Generate new token (classic)**
3. Cocher les scopes : `repo`, `admin:repo_hook`
4. Copier le token généré (ne s'affiche qu'une fois !)

---

## Partie 4 – Lancer l'app en local

```bash
cd ~/Downloads/atelier11
npm install
npm start
# → http://localhost:3000
```

Tester les tests localement :

```bash
npm test
```

---

## Partie 5 – Push sur GitHub

```bash
cd ~/Downloads/atelier11
git init
git add .
git commit -m "Initial commit: calculatrice Node.js + Jenkinsfile"
git branch -M main
git remote add origin https://github.com/<TON_USER>/<TON_REPO>.git
git push -u origin main
```

---

## Partie 6 – Créer le Pipeline dans Jenkins

1. Jenkins → **New Item** → Nom : `calculatrice-pipeline` → Type : **Pipeline** → OK
2. Dans la config → Section **Pipeline** :
   - Definition : **Pipeline script from SCM**
   - SCM : **Git**
   - Repository URL : `https://github.com/<TON_USER>/<TON_REPO>.git`
   - Credentials : Ajouter → Username + ton PAT comme password
   - Branch : `*/main`
   - Script Path : `Jenkinsfile`
3. **Save** → **Build Now**

---

## Partie 7 – Automatisation avec Webhook + ngrok

### 7.1 Installer ngrok

```bash
brew install ngrok/ngrok/ngrok
```

S'inscrire sur https://ngrok.com et obtenir son authtoken :

```bash
ngrok config add-authtoken <TON_AUTHTOKEN>
```

### 7.2 Exposer Jenkins

```bash
ngrok http 8080
```

Copier l'URL publique affichée, ex : `https://abc123.ngrok-free.app`

### 7.3 Configurer le Webhook GitHub

1. Repo GitHub → **Settings** → **Webhooks** → **Add webhook**
2. Payload URL : `https://abc123.ngrok-free.app/github-webhook/`
3. Content type : `application/json`
4. Which events : **Just the push event**
5. **Add webhook**

### 7.4 Activer le déclencheur dans Jenkins

1. Pipeline config → **Build Triggers**
2. Cocher **"GitHub hook trigger for GITScm polling"**
3. Save

### 7.5 Test final

```bash
# Modifier un fichier
echo "// test webhook $(date)" >> index.js

git add .
git commit -m "Test webhook auto-build"
git push
```

→ Jenkins doit démarrer le build automatiquement.

---

## Rappel : Jenkinsfile (étape post)

Le Jenkinsfile inclut déjà le message demandé :

```groovy
post {
    success {
        echo 'Bravo, déploiement réussi !'
    }
}
```

---

## Commandes utiles

| Action                | Commande                                   |
| --------------------- | ------------------------------------------ |
| Démarrer Jenkins      | `brew services start jenkins-lts`          |
| Arrêter Jenkins       | `brew services stop jenkins-lts`           |
| Voir les logs Jenkins | `cat ~/.jenkins/jobs/<JOB>/builds/<N>/log` |
| Lancer les tests      | `npm test`                                 |
| Démarrer le serveur   | `npm start`                                |
| Exposer avec ngrok    | `ngrok http 8080`                          |
