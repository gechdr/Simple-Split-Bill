
import groovy.json.JsonOutput

/* ================================
   🔧 1. Global Variables & Helpers
   ================================ */

// Job metadata
def jobName = env.JOB_NAME
def dateStr = new Date().format("yyyyMMdd", TimeZone.getTimeZone("Asia/Jakarta"))
def buildNum = env.BUILD_NUMBER
def branchName = env.GIT_BRANCH?.trim() ?: "unknown-branch"

/* ================================
   📤 Discord Notification Function
   ================================ */
def sendDiscordMessage(data) {
    def payload = JsonOutput.toJson(data)


    withCredentials([string(credentialsId: 'KUSURI_WEBHOOK_URL', variable: 'WEBHOOK_URL')]) {
        sh """
            curl -H "Content-Type: application/json" \
            -X POST \
            -d '${payload}' \
            $WEBHOOK_URL
        """
    }
}

pipeline {
  agent { label "alien" }

  environment {
    IMAGE_STAGE = 'oven/bun:slim'
  }

  stages {

    stage('Discord Notify'){
        steps{            
            script{
                sendDiscordMessage([
                    content: "Starting Wrangler Build: ${jobName}",
                    embeds: [[
                        title: "Build #${buildNum}",
                        description: "Branch: ${branchName}\n",
                        color: 16776960
                    ]]
                ])
            }
        }
    }

    stage('Build Application') {
        agent {
            docker {
                image "${IMAGE_STAGE}"
                reuseNode true
            }
        }
        steps {
            script{
                sh """
                    set -e
                    bun install
                    bun run build
                """
            }
        }
    }

    stage('Sync Build To S3') {
        steps {
            script{
                sh """
                    . /home/marmar/.bash_profile
                    npx wrangler pages deploy ./dist --project-name=smangka
                """
            }
        }
    }
  }

  post {
    success {
      script {
        sendDiscordMessage([
          content: "Build Completed",
          embeds: [[
            title: "Build #${buildNum} Succeeded",
            description: "Job: ${jobName}\n",
            color: 1127128
          ]]
        ])
      }
    }

    failure {
      script {
        sendDiscordMessage([
          content: "Build Failed",
          embeds: [[
            title: "Build #${buildNum} FAILED",
            description: "Check Jenkins logs for details. Job: ${jobName}\n",
            color: 16711680
          ]]
        ])
      }
    }
  }
}

