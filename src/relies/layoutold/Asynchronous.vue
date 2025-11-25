<script>
  export default {
    name: "Asynchronous",
    beforeCreate() {
      if(this.$app.joinAppInitEnabled) {
        const JID = 'HDTY_joinsys';
        let JAppIds = this.$utilLogin.getJoinAppIds();
        let JEl = document.getElementById(JID);
        if(!JEl) {
          if(JAppIds && JAppIds.length > 0) {
            JEl = document.createElement('div');
            JEl.id = JID;
            JEl.style.display = 'none';
            document.body.appendChild(JEl);
            for (let appId of JAppIds) {
              this.$utilLink.getLinkPageURL({
                path: '/',
                appId: appId,
                subpage: false,
                bodypage: false,
                callback: ({ fullPath }) => {
                  let iframe = document.createElement('iframe');
                  iframe.src = fullPath;
                  iframe.name = appId;
                  JEl.appendChild(iframe);
                }
              });
            }
          }
        } else {
          if(JAppIds && JAppIds.length > 0) {
            let JChildEls = JEl.children;
            let JCompleteAddIds = [];
            [].forEach.call(JChildEls, e => {
              let completeAppId = e.getAttribute('name');
              if(JAppIds.indexOf(completeAppId) === -1) {
                e.remove();
              } else {
                JCompleteAddIds.push(completeAppId);
              }
            });
            for (let appId of JAppIds) {
              if(JCompleteAddIds.indexOf(appId) === -1) {
                this.$utilLink.getLinkPageURL({
                  path: '/',
                  appId: appId,
                  subpage: false,
                  bodypage: false,
                  callback: ({ fullPath }) => {
                    let iframe = document.createElement('iframe');
                    iframe.src = fullPath;
                    iframe.name = appId;
                    JEl.appendChild(iframe);
                  }
                });
              }
            }
          } else {
            JEl.remove();
          }
        }
      }
    },
    render(h) {
      return h();
    }
  }
</script>
