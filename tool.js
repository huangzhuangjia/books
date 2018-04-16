const ModalHelper = (function(bodyCls) {
    var scrollTop; // 在闭包中定义一个用来保存滚动位置的变量
    return {
      afterOpen: function() { //弹出之后记录保存滚动位置，并且给body添加.modal-open
        scrollTop = document.scrollingElement.scrollTop;
        document.body.classList.add(bodyCls);
        document.body.style.top = -scrollTop + 'px';
      },
      beforeClose: function() { //关闭时将.modal-open移除并还原之前保存滚动位置
        document.body.classList.remove(bodyCls);
        document.body.removeAttribute('style')
        document.scrollingElement.scrollTop = scrollTop;
      }
    };
  })('modal-open');

export default {
    /**
     * 
     * 阻止滚动穿透
     * @param {any} show 
     */
    stopBodyScroll (show) {
        show ? ModalHelper.afterOpen() : ModalHelper.beforeClose()
    },
    /**
     * 
     * 获取cookie
     * @param {any} name 
     * @returns 
     */
    getCookie (name) {
        let cookieName = encodeURIComponent(name) + '=',
            cookieStart = document.cookie.indexOf(cookieName),
            cookieValue = null
        if (cookieStart > -1){
            let cookieEnd = document.cookie.indexOf(';', cookieStart)
            if (cookieEnd > -1) {
                cookieEnd = document.cookie.length
            }
            cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd))
        }
        return cookieValue
    },
    /**
     * 微信端
     * 
     * @returns 
     */
    isWeChat () {
        return /MicroMessenger/i.test(navigator.userAgent.toLowerCase())
    },
    /**
     * IOS端
     * 
     * @returns 
     */
    isIos () {
        return /\(i[^;]+;( U;)? CPU.+Mac OS X/i.test(navigator.userAgent.toLowerCase())
    },
    /**
     * Android端
     * 
     * @returns 
     */
    isAndroid () {
        return navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent('Adr') > -1
    },
    /**
     * IOS,Android JS桥交互
     * 
     * @param {any} callback 
     * @returns 
     */
    setupWebViewJavascriptBridge (callback) {
        if (this.isIos()) {
            if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
            if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
            window.WVJBCallbacks = [callback];
            var WVJBIframe = document.createElement('iframe');
            WVJBIframe.style.display = 'none';
            WVJBIframe.src = 'https://__bridge_loaded__';
            document.documentElement.appendChild(WVJBIframe);
            setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
        }
        if (this.isAndroid()) {
            try {
                if (window.WebViewJavascriptBridge) {
                    callback(WebViewJavascriptBridge);
                } else {
                    document.addEventListener("WebViewJavascriptBridgeReady", function () {
                        callback(WebViewJavascriptBridge);
                    }, false);
                }
            } catch (ex) { }
        }
    }
}