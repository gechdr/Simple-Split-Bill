
import groovy.json.JsonOutput

/* ================================
   🔧 1. Global Variables & Helpers
   ================================ */

// Job metadata
def jobName = env.JOB_NAME
def dateStr = new Date().format("yyyyMMdd", TimeZone.getTimeZone("Asia/Jakarta"))
def buildNum = env.BUILD_NUMBER
def branchName = env.BRANCH_NAME ?: env.GIT_BRANCH?.replaceFirst(/^origin\\//, '') ?: "unknown"
def deployOutput = ""
def url = ""
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
  agent { label "chisato" }

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
            script {
                withCredentials([string(credentialsId: 'CLOUDFLARE_MARMAR', variable: 'CLOUDFLARE_API_TOKEN')]) {
                    try {
                        deployOutput = sh(
                            script: """
                                . /home/marmar/.bash_profile
                                npx wrangler pages deploy ./dist --project-name=smangka
                            """,
                            returnStdout: true
                        ).trim()

                        url = deployOutput.find(/https?:\/\/[^\s]+/)

                    } catch (err) {
                        deployOutput = err.getMessage()
                        throw err
                    }
                }

                echo "Deploy URL: ${url}"
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
            description: "Job: ${jobName}\nU can access the build at: ${url}",
            color: 1127128
          ],
          [
            title: "Wrangler Output",
            description: "```${deployOutput}```",
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

