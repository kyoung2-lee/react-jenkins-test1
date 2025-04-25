pipeline {
    agent any

    options {
        skipDefaultCheckout(true)
    }

    parameters {
        choice (name: 'Target', choices: 'BuildOnly\nBuild-Deploy', description: 'Job�̃^�[�Q�b�g��I�����Ă�������.')
        choice (name: 'Environment', choices: 'ITa\nITb1\nITb2\nITb3\nITb4', description: '�Ώۂ̊���I�����Ă�������.')
        choice (name: 'Version', choices: 'v1\nv1.5\nv2\nv3', description: 'Version���w�肵�Ă�������.')
    }

    environment {
        /* Git Credentials */
        CREDENTIAL_ID = 'apl_usr'
        SOURCE_GIT_URL = 'git@github.com:kyoung2-lee/test-jenkins2.git'
        MODULE_GIT_URL = 'ssh://soala_apl_01@SOALADC11T:22/D/Git/repos/SoalaModule.git'

        /* �J�X�^�����[�N�X�y�[�X�p�X */
        CUSTOM_DIR_SORUCE = 'D:\\Program Files\\Jenkins\\workspace\\SoalaSource.git'
        CUSTOM_DIR_MODULE = 'D:\\Program Files\\Jenkins\\workspace\\SoalaModule.git'

        /* spa App�t�H���_ */
        SPA_DIR = 'spa'
        
        /* ConfigControl�t�H���_Path */
        CONFIG_DIR = 'config'

        /* Config�t�@�C�� Prefix */
        CONF_FILE_PREFIX = 'config_jit_'

        /* Config�t�@�C�� Extension */
        CONF_FILE_DMZ_TS = '.ts'
        CONF_FILE_CLAN_TS = '_clan.ts'

        /* Base Config�t�@�C�� */
        BASE_CONFIG = 'config.ts'

        /* Build�㐬�ʕ��t�H���_�� */
        BUILD_RESULT_DMZ = 'Spa.dmz'
        BUILD_RESULT_CLAN = 'Spa.clan'

        /* Deploy�p�ڑ���� */
        USER_NAME = 'soala_apl_01'
        PASS = 'Passwordsw23ed'

        /* Web.config */
        WEB_CONFIG_FILE = 'web.config'

        /* ResouceLock�t�@�C�� */
        LOCKABLE_RESOURCE = 'D:\\Work\\Resource\\Concurrency-Lockable-git-Resource.dat'

        /* �ǂݍ���Shell */
        SHELL_GET_API_WEBFOLDER = 'D:\\Soala_Apl\\Tool\\Jenkins\\get-apispa-webfolder.ps1'
        SHELL_GET_BRIDGE_WEBFOLDER = 'D:\\Soala_Apl\\Tool\\Jenkins\\get-bridgespa-webfolder.ps1'
    }

    stages {
        stage('Concurrency-Lock') {
            steps {
                script {
                    echo 'Resource lock Starting...'

                    lock(resource: env.LOCKABLE_RESOURCE, inversePrecedence: true) {
                        stage("SoalaSource Checkout") {
                            checkout([$class: 'GitSCM', 
                                     branches: [[name: env.BRANCH_NAME]], 
                                     doGenerateSubmoduleConfigurations: false, 
                                     extensions: [
                                        [$class: 'PruneStaleBranch'],
                                        [$class: 'CleanBeforeCheckout'], 
                                        [$class: 'RelativeTargetDirectory', relativeTargetDir: env.CUSTOM_DIR_SORUCE]], 
                                     submoduleCfg: [], 
                                     userRemoteConfigs: [[credentialsId: env.CREDENTIAL_ID, url: env.SOURCE_GIT_URL]]])
                        }   
                        stage("SoalaModule Checkout") {
                            checkout([$class: 'GitSCM', 
                                     branches: [[name: env.BRANCH_NAME]], 
                                     doGenerateSubmoduleConfigurations: false, 
                                     extensions: [
                                        [$class: 'PruneStaleBranch'],
                                        [$class: 'CleanBeforeCheckout'], 
                                        [$class: 'RelativeTargetDirectory', relativeTargetDir: env.CUSTOM_DIR_MODULE]], 
                                     submoduleCfg: [], 
                                     userRemoteConfigs: [[credentialsId: env.CREDENTIAL_ID, url: env.MODULE_GIT_URL]]])
                        }
                        stage("Build") {
                            /* Build������Rename�����͓����Bat�̒��ł͂ł��܂���B */
                            bat '''
                                @echo off
                                SET AttachConfName=%CONF_FILE_PREFIX%%Environment%%CONF_FILE_DMZ_TS%

                                COPY /Y "%CUSTOM_DIR_SORUCE%\\%SPA_DIR%\\%CONFIG_DIR%\\%AttachConfName%" "%CUSTOM_DIR_SORUCE%\\%SPA_DIR%\\%CONFIG_DIR%\\%BASE_CONFIG%"
                                cd "%CUSTOM_DIR_SORUCE%\\%SPA_DIR%"
                                yarn build
                            '''
                            bat '''
                                ren "%CUSTOM_DIR_SORUCE%\\%SPA_DIR%\\dist" "%BUILD_RESULT_DMZ%"
                            '''
                            bat '''
                                @echo off
                                SET AttachConfName=%CONF_FILE_PREFIX%%Environment%%CONF_FILE_CLAN_TS%

                                COPY /Y "%CUSTOM_DIR_SORUCE%\\%SPA_DIR%\\%CONFIG_DIR%\\%AttachConfName%" "%CUSTOM_DIR_SORUCE%\\%SPA_DIR%\\%CONFIG_DIR%\\%BASE_CONFIG%"
                                cd "%CUSTOM_DIR_SORUCE%\\%SPA_DIR%"
                                yarn build
                            '''
                            bat '''
                                ren "%CUSTOM_DIR_SORUCE%\\%SPA_DIR%\\dist" "%BUILD_RESULT_CLAN%"
                            '''
                            
                        }
                        if (params.Target != 'BuildOnly') {
                            stage("Deploy") {
                                powershell'''
                                    ### Script Loading
                                    . $env:SHELL_GET_API_WEBFOLDER
                                    . $env:SHELL_GET_BRIDGE_WEBFOLDER
                                    
                                    ### Build���ʕ������݂���t�H���_�p�X����
                                    $DmzResultPath = Join-Path $env:CUSTOM_DIR_SORUCE $env:SPA_DIR | Join-Path -ChildPath $env:BUILD_RESULT_DMZ
                                    $ClanResultPath = Join-Path $env:CUSTOM_DIR_SORUCE $env:SPA_DIR | Join-Path -ChildPath $env:BUILD_RESULT_CLAN

                                    ### web.config �p�X�𐶐�
                                    $WebConfPath = Join-Path $env:CUSTOM_DIR_SORUCE $env:SPA_DIR | Join-Path -ChildPath $env:WEB_CONFIG_FILE

                                    Copy-Item $WebConfPath -destination $DmzResultPath -ErrorAction Stop
                                    Copy-Item $WebConfPath -destination $ClanResultPath -ErrorAction Stop

                                    ### Deploy��t�H���_�擾
                                    $ApiWebFolderName = get-apispa-webfolder $env:Environment "SOALAWB11T"
                                    $BridgeWebFolderName = get-bridgespa-webfolder $env:Environment "SOALAWB11T"

                                    D:\\Soala_Apl\\Tool\\Jenkins\\spadmz-deploy.bat "$DmzResultPath" "$BridgeWebFolderName" "$env:Version" "SOALAWB11T" $env:USER_NAME $env:PASS
                                    D:\\Soala_Apl\\Tool\\Jenkins\\spaclan-deploy.bat "$ClanResultPath" "$ApiWebFolderName" "SOALAWB11T" $env:USER_NAME $env:PASS
                                '''
                            }
                        }
                    }
                }
            }   
        }
    }
}