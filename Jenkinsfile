pipeline {
    agent any

    tools {
        nodejs 'NodeJS'   // Nom configuré dans Jenkins > Manage Jenkins > Tools
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
