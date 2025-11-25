node {
    //项目SVN路径
    def svnAddress = 'http://172.16.60.141/svn/IHUATOP/软件研发中心/在建项目/web前端框架/Program/程序源码/trunk/hdty-framework-web'
    //JenkinsSVN凭证ID 写自己的
    def svnAccount = 'f0b4df75-4d16-49cf-97e2-6ea952c13997'
    //项目服务器端口
    def port = '20064'
    //服务器IP
    def hostname = '172.16.60.218'
    //服务器密码
    def hostPassword = 'yfb@2019'
    //服务器tomcat路径
    def tomcatAddress = '/usr/local/wfw/tomcat8_20064_hdtyadmin_web'

    //拉取源码
    stage('CheckoutSourceCode') {
        checkout([$class: 'SubversionSCM', additionalCredentials: [], excludedCommitMessages: '', excludedRegions: '', excludedRevprop: '', excludedUsers: '', filterChangelog: false, ignoreDirPropChanges: false, includedRegions: '', locations: [[cancelProcessOnExternalsFail: true, credentialsId: svnAccount, depthOption: 'infinity', ignoreExternalsOption: true, local: '.', remote: svnAddress]], quietOperation: true, workspaceUpdater: [$class: 'UpdateUpdater']])
    }
    //编译
   stage('NpmBuild') {
      sh '''
        npm install
        npm run build
      '''
   }
   //删除旧版本
   stage('DeleteOldVersion') {
      sh '''
       sshpass -p '''+hostPassword+''' ssh -tt root@'''+hostname+''' << eeooff
rm -rf '''+tomcatAddress+'''/webapps/ROOT/static/*
rm -rf '''+tomcatAddress+'''/webapps/ROOT/index.html
exit
eeooff
      '''
   }

   //拷贝文件到tomcat
   stage('CopyFilesToTomcat') {
     sh '''
        sshpass -p '''+hostPassword+''' scp -r 1.*/* root@'''+hostname+''':'''+tomcatAddress+'''/webapps/ROOT/
exit
eeooff
      '''
   }


   //判断启动状态没启动启动tomcat
   stage('StartTomcatIfShutdown') {
      sh '''
        pid=$(sshpass -p '''+hostPassword+''' ssh -tt root@'''+hostname+''' "netstat -nlp | grep '''+port+''' | awk '{print $7}' | awk -F"/" '{ print $1 }'"| awk '{print $7}' | awk -F"/" '{print $1}')
        sshpass -p '''+hostPassword+''' ssh -tt root@'''+hostname+''' << eeooff
if [  -n  "$pid"  ];  then
   echo "tomcat is running"
else
  '''+tomcatAddress+'''/bin/startup.sh
fi
exit
eeooff
      '''
    }
}
