let fileList = $('#fileList');
let proList = $('#proList');
window.request = false;

// 获取网址参数
function getQueryString(name){
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}
let uid = getQueryString('uid');

function showLoad() {
    $('.shadow').removeClass('hide');
    $('.loading').removeClass('hide');
}
function hideLoad() {
    $('.shadow').addClass('hide');
    $('.loading').addClass('hide');
}
function show(){
    $('.shadow').removeClass('hide');
    $('.model').removeClass('hide');
}
function hide(){
    $('.shadow').addClass('hide');
    $('.model').addClass('hide');
}
// 点击创建文件显示模态对话框，提供文件创建功能 (python or c)
$('#createFile').click(function () {
    $('.newFile').removeClass('hide');
    $('.newPro').addClass('hide');
    $('.newJavaFile').addClass('hide');
    show();
});

// 点击创建项目显示模态对话框，提供项目创建功能 (java)
$('#createPro').click(function () {
    $('.newFile').addClass('hide');
    $('.newJavaFile').addClass('hide');
    $('.newPro').removeClass('hide');
    show();
});


// 点击模态对话框取消按钮后隐藏对话框
$('.hideModel').click(function () {
   hide();
});

// 点击确定创建文件
$('#addFile').click(function () {
    let curFileType = $('.select').text().replace(' ', '');
    if (curFileType === 'python') {
        curFileType = 'py';
    }
    let val = $('#fileName').val();
    if (val) {
        if (val.split('.')[1] !== curFileType) {
            alert('该环境不支持此类语言的编译运行，请移步 ' + val.split('.')[1] + ' 语言开发环境');
        } else {
            $.ajax({
            url: '/addFile.html',
            type: 'get',
            data: {
                fileName: val,
                uid: uid
            },
            success: function (arg) {    // 后台创建该项目文件并返回创建成功与否标志
                // 1.如果床建成功，则将项目名称渲染到页面指定位置
                if (arg === '1') {
                    hide();
                    let type = val.split('.')[1];
                    if (type === 'py') {
                        type = 'python';
                    }
                    fileList.append('<li class="file"><img width="20px" src="../static/images/' + type + '.png"' +
                    ' title="' + type + '" alt="' + type + 'Logo"/>&nbsp;&nbsp;' + val + '<span class="delFile" ' +
                    'filepath="' + val + '"><i class="fa fa-remove" aria-hidden="true"></i></span>')
                } else {          // 2.若项目在当前工作空间已经存在则会导致创建项目失败，此时应显示失败提示并取消创建项目
                    alert('该项目已经存在，请勿重复创建')
                }
            }
        })
        }
    } else {
        alert("项目名不能为空！")
    }

});

// 点击确定创建java项目
$('#addPro').click(function () {
    let proName = $('#proName').val();
    $.ajax({
        url: 'addJavaPro.html',
        type: 'get',
        data: {
            uid: uid,
            proName: proName
        },
        success: function (args) {
            if (args === '1') {
                hide();
                proList.append('<li class="pro" request="false"><div class="status arrow-right"></div><i class="fa fa-folder" aria-hidden="true">' +
                            '</i>&nbsp;&nbsp;' + proName + '<span class="addJavaFile" propath="' + proName + '">' +
                    '<i class="fa fa-plus-circle" aria-hidden="true"></i></span><span class="delJavaPro" proPath="' + proName + '">' +
                            '<i class="fa fa-remove" aria-hidden="true"></i></span></li>');
            } else {
                alert('该项目已经存在，请勿重复创建！');
            }
        }
    })
});

// 点击确定创建java文件
$('#addJavaFile').click(function () {
    let javaFileName = $('#javaFileName').val();
    if (javaFileName.split('.')[1] !== 'java') {
        alert('该环境下不支持对此类型文件的编译运行！')
    } else {
        $.ajax({
        url: 'addJavaFile.html',
        type: 'get',
        data: {
            uid: uid,
            proPath: window.proPath,
            javaFileName: javaFileName
        },
        success: function (args) {
            if (args === '1') {
                hide();
                let allLi = proList.children();
                for (let i = 0; i < allLi.length; i++) {
                    if (allLi[i].innerText.slice(2) === window.proPath) {
                        self = $(allLi[i]);
                        break;
                    }
                }
                let li;
                if (self.attr('request') === 'true') {
                    if (self.children('.status').hasClass('arrow-down')) {
                        li = '<li class="javaFile"><img src="../static/images/java.png" width="20px;">' +
                                '&nbsp;&nbsp;' + javaFileName + '<span class="delJavaFile" ' +
                        'filepath="' + proPath + '/' + javaFileName + '">' +
                            '<i class="fa fa-remove" aria-hidden="true"></i></span></li>';
                    } else {
                        li = '<li class="javaFile hide"><img src="../static/images/java.png" width="20px;">' +
                                '&nbsp;&nbsp;' + javaFileName + '<span class="delJavaFile" ' +
                        'filepath="' + proPath + '/' + javaFileName + '">' +
                            '<i class="fa fa-remove" aria-hidden="true"></i></span></li>';
                    }
                    self.after(li)
                }
            } else {
                alert('该文件已经存在，不可重复创建');
            }
        }
    })
    }
});

// 获取元素样式属性（不仅仅是行内样式）
var getStyle = function(obj, attr){
	// 兼容IE
	if (obj.currentStyle) {
		return obj.currentStyle[attr];
	}else{
		// 适用于主流浏览器
		return getComputedStyle(obj, null)[attr];
	}
};

// 显示控制台
function showConsole(self){
    $('.content').animate({
            'top': '60%'
        });
        $(self).animate({
            'bottom': '100%'
        });
        $(self).text('收起');
}

// 隐藏控制台
function hideConsole(self){
    $('.content').animate({
            'top': '100%'
        });
        $(self).animate({
            'bottom': '0'
        });
        $(self).text('显示');
}

// 收起（显示）控制台
$('.close').click(function () {
    if (getStyle(this, 'bottom') !== '0px') {
        hideConsole(this)
    } else {
        showConsole(this);
    }

});

// 保存代码
$('#saveCode').click(function () {
    showLoad();
    // 将编辑区代码发送到后台并保存到相应文件中
    var rows = $('#editCode div');
    var arr = [];
    for (var i = 0; i < rows.length; i++) {
        var text = rows[i].innerText;
        if (text !== '\n') {
            arr.push(rows[i].innerText);
        } else {
            arr.push('');
        }
    }
    // 获取当前文件名称
    let proName = null;
    let curFileName = $('.curFileName').text();
    if (curFileName.split('.')[1] === 'java') {
        proName = $('.curProName').text().slice(0, -1);
    }
    $.ajax({
        url: 'saveCode.html',
        type: 'post',
        data: {
            code: arr.join('\n'),
            proName: proName,
            filename: curFileName,
            uid: uid
        },
        success: function (args) {
            hideLoad();
        }
    })
});

// 运行程序
$('#runCode').click(function () {
    showLoad();
    var rows = $('#editCode div');
    var arr = [];
    for (var i = 0; i < rows.length; i++) {
        var text = rows[i].innerText;
        if (text !== '\n') {
            arr.push(rows[i].innerText);
        } else {
            arr.push('');
        }
    }
    // 获取当前文件名称
    let filename = $('.curFileName').text();
    let proName;
    // 获取当前项目名称，在运行Java文件时很有必要
    proName = $('.curProName').text().slice(0, -1);
    $.ajax({
        url: '/runCode.html',
        type: 'post',
        data: {
            code: arr.join('\n'),
            filename: filename,
            uid: uid,
            proName: proName
        },
        success: function (args) {
            if (!args) {
                args = '编译错误！请检查您的代码。';
            }
            hideLoad();
            var content = $('.console .content');
            showConsole(document.getElementsByClassName('close')[0]);
            content.text(filename + '\n' + args);
        }
    })
});

// 监听代码编辑区高度的变化从而改变行号（由于代码性能问题在更新时会存在延迟较大的情况，待优化。。。）
(function($,h,c){var a=$([]),e=$.resize=$.extend($.resize,{}),i,k="setTimeout",j="resize",d=j+"-special-event",b="delay",f="throttleWindow";e[b]=250;e[f]=true;$.event.special[j]={setup:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.add(l);$.data(this,d,{w:l.width(),h:l.height()});if(a.length===1){g()}},teardown:function(){if(!e[f]&&this[k]){return false}var l=$(this);a=a.not(l);l.removeData(d);if(!a.length){clearTimeout(i)}},add:function(l){if(!e[f]&&this[k]){return false}var n;function m(s,o,p){var q=$(this),r=$.data(this,d);r.w=o!==c?o:q.width();r.h=p!==c?p:q.height();n.apply(this,arguments)}if($.isFunction(l)){n=l;return m}else{n=l.handler;l.handler=m}}};function g(){i=h[k](function(){a.each(function(){var n=$(this),m=n.width(),l=n.height(),o=$.data(this,d);if(m!==o.w||l!==o.h){n.trigger(j,[o.w=m,o.h=l])}});g()},e[b])}})(jQuery,this);
$('#codeContent').resize(function () {
    var height = $(this).height() - 2;
    var lines = Math.round(height / 20.8);
    var lineNumber = document.getElementsByClassName('lineNumber')[0];
    if (lines > lineNumber.children.length) {    // 换行
        // 获取最后一行的行号
        var lastLineNumber = parseInt(lineNumber.lastChild.innerText);
        for (var i = lastLineNumber + 1; i <= lines; i++) {
            $('.lineNumber').append('<li>' + i + '</li>');
        }
    } else if (lines < lineNumber.children.length) {    // 退行
        for (var j = lineNumber.children.length; j > lines; j--) {
            $(lineNumber.lastChild).remove();
        }
    }
});

// 对代码编辑区tab键的效果实现
var edit = document.getElementById('editCode');
edit.onkeydown = function () {
    if (event.keyCode === 9) { // tab key
    event.preventDefault();  // this will prevent us from tabbing out of the editor

    var editor = document.getElementById("editCode");
    var doc = editor.ownerDocument.defaultView;
    var sel = doc.getSelection();
    var range = sel.getRangeAt(0);
    var tabNode = document.createTextNode('    ');
    range.insertNode(tabNode);

    range.setStartAfter(tabNode);
    range.setEndAfter(tabNode);
    sel.removeAllRanges();
    sel.addRange(range);
  }
};


$('#del').click(function () {
    filename = $(window).attr('filepath');
    if (filename.indexOf('/') !== -1) {     // 删除java文件
        $.ajax({
            url: 'delJavaFile.html',
            type: 'get',
            data: {
                uid: uid,
                filePath: filename
            },
            success: function (args) {
                self.parent().remove();
            }
        })
    } else if (filename.indexOf('.') !== -1) {          // 删除python和c文件
        $.ajax({
            url: 'delFile.html',
            type: 'get',
            data: {
                uid: uid,
                filename: $(window).attr('filepath')
            },
            success: function (args) {
                let child = fileList.children();
                for (let i = 0; i < child.length; i++) {
                    if (child[i].innerText.slice(2) === window.filepath) {
                        child[i].remove();
                        if ($(child[i]).hasClass('active')) {
                            $('#code').addClass('hide');
                        }
                    }
                }
            }
        })
    } else {        // 删除java项目
        $.ajax({
            url: 'delJavaPro.html',
            type: 'get',
            data: {
                uid: uid,
                proName: filename
            },
            success: function (args) {
                self.parent().remove();
            }
        })
    }
    $('.shadow').addClass('hide');
    $('.delFileModel').addClass('hide');
});

$('#cancel').click(function () {
    $('.shadow').addClass('hide');
    $('.delFileModel').addClass('hide');
});

$('#cFile').click(function () {
    if (!$(this).hasClass('select')) {
        $('.pythonAndC').removeClass('hide');
        $('.java').addClass('hide');
        $('#javaFile').removeClass('select');
        $('#pythonFile').removeClass('select');
        $(this).addClass('select');
        getFile('getCFile.html', 'c');
    }
});

$('#pythonFile').click(function () {
    if (!$(this).hasClass('select')) {
        $('.pythonAndC').removeClass('hide');
        $('.java').addClass('hide');
        $('#javaFile').removeClass('select');
        $('#cFile').removeClass('select');
        $(this).addClass('select');
        getFile('getPythonFile.html', 'python');
    }
});

$('#javaFile').click(function () {
    if (!$(this).hasClass('select')) {
        $('#cFile').removeClass('select');
        $('#pythonFile').removeClass('select');
        $('.pythonAndC').addClass('hide');
        $('.java').removeClass('hide');
        $(this).addClass('select');
        proList.children().remove();
        $.ajax({
            url: 'getJavaPro.html',
            type: 'get',
            dataType: 'json',
            data: {
                uid: uid
            },
            success: function (args) {    // 获取用户工作空间所有java项目列表
                let curProName = $('.curProName').text();
                let pros;
                for (let i = 0; i < args.length; i++) {
                    if (args[i] === curProName) {
                        pros = '<li class="pro active" request="false"><div class="status arrow-right"></div><i class="fa fa-folder" aria-hidden="true">' +
                            '</i>&nbsp;&nbsp;' + args[i] + '<span class="addJavaFile" proPath="' + args[i] + '">' +
                            '<i class="fa fa-plus-circle" aria-hidden="true"></i></span>' +
                            '<span class="delJavaPro" proPath="' + args[i] + '">' +
                            '<i class="fa fa-remove" aria-hidden="true"></i></span></li>';
                    } else {
                        pros = '<li class="pro" request="false"><div class="status arrow-right"></div><i class="fa fa-folder" aria-hidden="true">' +
                            '</i>&nbsp;&nbsp;' + args[i] + '<span class="addJavaFile" proPath="' + args[i] + '">' +
                            '<i class="fa fa-plus-circle" aria-hidden="true"></i></span>' +
                            '<span class="delJavaPro" proPath="' + args[i] + '">' +
                            '<i class="fa fa-remove" aria-hidden="true"></i></span></li>';
                    }
                    proList.append(pros);
                }
            }
        })
    }
});

proList.on('click', '.addJavaFile', function () {
    $('.newFile').addClass('hide');
    $('.newPro').addClass('hide');
    $('.newJavaFile').removeClass('hide');
    show();
    window.proPath = $(this).attr('proPath');
    return false;
});

proList.on('click', '.pro', function () {
    let nextAll = $(this).nextAll();   // 获取当前元素后面的所有li标签
    if ($(this).hasClass('active')) {
        if ($(this).children('.status').hasClass('arrow-right')) {   // 将项目目录打开，获取该项目下所有的文件并渲染到页面指定位置
            $(this).children('.status').removeClass('arrow-right');
            $(this).children('.status').addClass('arrow-down');
            for (let i = 0; i < nextAll.length; i++) {
                if ($(nextAll[i]).hasClass('javaFile')) {
                    $(nextAll[i]).removeClass('hide');
                } else {
                    break;
                }
            }
        } else {        // 将项目目录关闭
            $(this).children('.pro').remove();
            $(this).children('.status').addClass('arrow-right');
            $(this).children('.status').removeClass('arrow-down');

            for (let i = 0; i < nextAll.length; i++) {
                if ($(nextAll[i]).hasClass('javaFile')) {
                    $(nextAll[i]).addClass('hide');
                } else {
                    break;
                }
            }
        }
    } else {          // 获取该项目下所有java文件
        if ($(this).attr('request') === 'true') {
            let allLi = $('#proList li');
            for (let i = 0; i < allLi.length; i++) {
                $(allLi[i]).removeClass('active');
            }
            $(this).addClass('active');
        } else {
            $(this).attr('request', 'true');
            let pros = $('.pro');
            for (let i = 0; i < pros.length; i++) {
                pros[i].classList.remove('active');
            }
            $(this).addClass('active');
            $(this).children('.status').removeClass('arrow-right');
            $(this).children('.status').addClass('arrow-down');
            let self = $(this);
            let proName = $(this).text().slice(2);
            $.ajax({
                url: 'getJavaFile.html',
                type: 'get',
                dataType: 'json',
                data: {
                    uid: uid,   // 用户id，用以锁定用户工作空间
                    proName: proName
                },
                success: function (args) {
                    for (let i = 0; i < args.length; i++) {
                        self.after('<li class="javaFile"><img src="../static/images/java.png" width="20px;">' +
                            '&nbsp;&nbsp;' + args[i] + '<span class="delJavaFile" ' +
                    'filepath="' + proName + '/' + args[i] + '"><i class="fa fa-remove" aria-hidden="true"></i></span></li>')
                    }
                }
            })
        }
    }
});


getFile('getPythonFile.html', 'python');

// 封装获取对应类型文件方法，用于获取各类待运行文件
function getFile(url, type) {
    fileList.children().remove();
    let curFileName = $('.curFileName').text();
    let files;
    $.ajax({
        url: url,
        type: 'get',
        dataType: 'json',
        data: {
            uid: uid
        },
        success: function (args) {
            for (var i = 0; i < args.length; i++) {
                if (args[i] === curFileName) {
                    files = '<li class="file active"><img width="20px" src="../static/images/' + type + '.png"' +
                    ' title="' + type + '" alt="' + type + 'Logo"/>&nbsp;&nbsp;' + args[i] + '<span class="delFile" ' +
                    'filepath="' + args[i] + '"><i class="fa fa-remove" aria-hidden="true"></i></span>'
                } else {
                    files = '<li class="file"><img width="20px" src="../static/images/' + type + '.png"' +
                    ' title="' + type + '" alt="' + type + 'Logo"/>&nbsp;&nbsp;' + args[i] + '<span class="delFile" ' +
                    'filepath="' + args[i] + '"><i class="fa fa-remove" aria-hidden="true"></i></span>'
                }
                fileList.append(files);
            }

        }
    })
}

// 双击文件名触发该事件，通过后台获取文件中的代码并显示到客户端代码编辑区(python or c)
fileList.on('dblclick', '.file', function () {
	$('.curProName').text('');
    if ($(this).hasClass('active')) {
        return 0;
    } else {
        $('.curFileName').text($(this).text().slice(2));
        $('#code').removeClass('hide');
        var files = $('.file');
        for (var i = 0; i < files.length; i++) {
            files[i].classList.remove('active');
        }
        $(this).addClass('active');
        $.ajax({
            url: '/getFileCode.html',
            type: 'get',
            data: {
                uid: uid,
                filename: $(this).text()
            },
            success: function (args) {
                var childCode = $('#editCode div');
                var childLine = $('.lineNumber li');
                var editCode = document.getElementById('editCode');
                var lines = document.getElementsByClassName('lineNumber')[0];
                for (var j = 0; j < childLine.length; j++) {
                    editCode.removeChild(childCode[j]);
                    lines.removeChild(childLine[j]);
                }
                let arr = args.split('\n');
                for (let i = 0; i < arr.length; i++) {
                    if (!arr[i]) {
                        content = '<br>';
                    } else {
                        content = arr[i].replace('<', '&lt').replace('>', '&gt');
                    }
                    $('.lineNumber').append('<li>' + (i + 1) + '</li>');
                    $('#editCode').append('<div>' + content + '</div>');
                }
            }
        })
    }
});

// 双击java文件名触发该事件，通过后台获取文件中的代码并显示到客户端代码编辑区(java)
proList.on('dblclick', '.javaFile', function () {
    if ($(this).hasClass('active')) {
        return 0;
    } else {
        let pros = $('.pro');
        for (let i = 0; i < pros.length; i++) {
            $(pros[i]).removeClass('active');
        }
        let prevAll = $(this).prevAll();
        for (let i = 0; i < prevAll.length; i++) {
            if ($(prevAll[i]).hasClass('pro')) {
                $(prevAll[i]).addClass('active');
                $('.curProName').text($(prevAll[i]).text().slice(2) + '/');
                break;
            }
        }
        $('.curFileName').text($(this).text().slice(2));
        $('#code').removeClass('hide');
        var files = $('.javaFile');
        for (var i = 0; i < files.length; i++) {
            files[i].classList.remove('active');
        }
        $(this).addClass('active');
        $.ajax({
            url: '/getJavaFileCode.html',
            type: 'get',
            data: {
                uid: uid,
                filename: $($(this).children('.delJavaFile')).attr('filePath')
            },
            success: function (args) {
                var childCode = $('#editCode div');
                var childLine = $('.lineNumber li');
                var editCode = document.getElementById('editCode');
                var lines = document.getElementsByClassName('lineNumber')[0];
                for (var j = 0; j < childCode.length; j++) {
                    editCode.removeChild(childCode[j]);
                    lines.removeChild(childLine[j]);
                }
                let arr = args.split('\n');
                for (let i = 0; i < arr.length; i++) {
                    if (!arr[i]) {
                        content = '<br>';
                    } else {
                        content = arr[i].replace('<', '&lt').replace('>', '&gt');
                    }
                    $('.lineNumber').append('<li>' + (i + 1) + '</li>');
                    $('#editCode').append('<div>' + content + '</div>');
                }
            }
        })
    }
});

// 删除文件(python or c)
fileList.on('click', '.delFile', function () {
    window.filepath = $(this).attr('filepath');
    $('.shadow').removeClass('hide');
    $('.delFileModel').removeClass('hide');
});

// 删除java文件
proList.on('click', '.delJavaFile', function () {
    window.filepath = $(this).attr('filepath');
    self = $(this);
    $('.shadow').removeClass('hide');
    $('.delFileModel').removeClass('hide');
});

proList.on('click', '.delJavaPro', function () {
    window.filepath = $(this).attr('proPath');
    self = $(this);
    $('.shadow').removeClass('hide');
    $('.delFileModel').removeClass('hide');
    return false;
});
