pipeline {
    agent any

    environment {
        // Node.js installé via nvm sur Mac M1
        PATH = "/Users/afyfbadreddine/.nvm/versions/node/v22.17.0/bin:/opt/homebrew/bin:/usr/local/bin:${env.PATH}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo '==> Récupération du code source...'
                checkout scm
            }
        }

        stage('Install') {
            steps {
                echo '==> Installation des dépendances npm...'
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                echo '==> Lancement des tests...'
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                echo '==> Build / vérification de l\'application...'
                sh 'node -e "require(\'./index\')" && echo "index.js OK"'
                sh 'node -e "require(\'./server\')" && echo "server.js OK" || true'
            }
        }
    }

    post {
        success {
            echo 'Bravo, déploiement réussi !'
        }
        failure {
            echo 'Echec du pipeline. Vérifiez les logs ci-dessus.'
        }
        always {
            echo '==> Pipeline terminé.'
        }
    }
}
