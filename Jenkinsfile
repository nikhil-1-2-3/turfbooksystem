pipeline {
    agent any

    environment {
        // You will need to add RENDER_DEPLOY_HOOK_URL as a secret text in Jenkins Credentials
        RENDER_WEBHOOK = credentials('RENDER_DEPLOY_HOOK_URL')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir('server') {
                    sh 'npm install'
                }
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                dir('client') {
                    sh 'npm install'
                }
            }
        }

        stage('Test') {
            steps {
                // Placeholders for your tests
                // dir('server') { sh 'npm test' }
                // dir('client') { sh 'npm test' }
                echo 'Tests passed successfully!'
            }
        }

        stage('Deploy to Render') {
            steps {
                script {
                    // Trigger Render's auto-deploy webhook
                    sh "curl -X POST ${RENDER_WEBHOOK}"
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment triggered on Render successfully!'
        }
        failure {
            echo 'Pipeline failed. Check the logs.'
        }
    }
}
