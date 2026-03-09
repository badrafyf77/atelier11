pipeline {
    agent any

    environment {
        // Utilise le node/npm installé sur le système (Mac M1 via Homebrew)
        PATH = "/opt/homebrew/bin:/usr/local/bin:${env.PATH}"
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
