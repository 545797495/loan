/*input*/
function inputCheck(obj, status) {
  $(obj).on('input propertychange', function() {
    /*限制整数的*/
    if (status < 1) {
      this.value = this.value.replace(/[^\d]/g, '');
    } else {
      /*限制整小数的*/
      this.value = this.value.replace(/[^\d+\.?\d]/g, '');
    }
  });
}
/*url*/
function getQuery(p) {
  var reg = new RegExp("(^|&)" + p + "=([^&]*)(&|$)", "i");
  var r = window.location.search.substr(1).match(reg);
  return r ? decodeURI(r[2]) : null;
}
/*dialog*/
function dialog(opts) {
  var mask = $('<div class="mask" style="display:block"></div>');
  var content = $('<div class="dialog-content"></div>');
  var dialogBody = $('<div class="dialog-body">' + opts.content + '</div>');
  var destoryDialog = function() {
    mask.remove();
    content.remove();
  }
  content.append(dialogBody);

  if (opts.buttons) {
    var btbox = $('<div class="bt-box tc clearfix"></div>');
    $.each(opts.buttons, function(idx, button) {
      var btn = $('<a class="' + button.myClassName + '">' + button.text + '</a>');
      btn.on('click', function() {
        if (!$.isFunction(button.callback)) {
          destoryDialog();
        } else {
          button.callback(destoryDialog);
        }
      });
      btbox.append(btn);
    });
    content.append(btbox);
  }
  mask.append(content);
  $('body').append(mask);
  $('body').append(content);
  $.isFunction(opts.onAfterShow) && opts.onAfterShow();
  return content;
}
/*refresh*/
var myScroll;

function loaded() {
  var pullUpEl = document.getElementById('pullUp');
  var pullUpOffset = pullUpEl.offsetHeight;
  myScroll = new iScroll('wrapper', {
    useTransition: true,
    onRefresh: function() {
      if (pullUpEl.className.match('loading')) {
        pullUpEl.className = '';
        pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉更新';
      }
    },
    onScrollMove: function() {
      if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
        pullUpEl.className = 'flip';
        pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉更新';
        this.maxScrollY = this.maxScrollY;
      } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
        pullUpEl.className = '';
        pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉更新';
        this.maxScrollY = pullUpOffset;
      }
    },
    onScrollEnd: function() {
      if (pullUpEl.className.match('flip')) {
        pullUpEl.className = 'loading';
        pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中';
        pullUpAction();
      }
    }
  });
  setTimeout(function() {
    document.getElementById('wrapper').style.left = '0';
  }, 800);
}