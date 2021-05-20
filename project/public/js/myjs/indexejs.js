    
        function createModalForNewsFeed(id_post, images) {

            var html = '';
            html += `<div class="modal fade" id="Modal-` + id_post + `"tabindex="-1" role="dialog">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div id="myCarousel-` + id_post + `" class="carousel slide" data-ride="carousel">
                                        <!-- Wrapper for slides -->
                                        <div id="listhinh-` + id_post + `" class="carousel-inner">`

            if (images.length > 0) {
                images.forEach(e => {
                    var idimgTag = "img-preview-" + id_post + "-" + e.id;
                    html += `<div class="item">
                                                        <img id="`+ idimgTag + `" class="listFile-` + id_post + `" style="width:100%;max-height:400px;" src="` + mainURL + "/" + e.image + `">
                                                    </div>`
                });
            } else {
                html += `<div class="item active">
                                <img src="https://media.macphun.com/img/uploads/customer/how-to/579/15531840725c93b5489d84e9.43781620.jpg"
                                    alt="Los Angeles" style="width:100%;max-height:400px;">
                            </div>`
            }

            html += `</div>
                                        <!-- Left and right controls -->
                                        <a class="left carousel-control" href="#myCarousel-` + id_post + `" data-slide="prev">
                                            <span class="glyphicon glyphicon-chevron-left"></span>
                                            <span class="sr-only">Previous</span>
                                        </a>
                                        <a class="right carousel-control" href="#myCarousel-` + id_post + `" data-slide="next">
                                            <span class="glyphicon glyphicon-chevron-right"></span>
                                            <span class="sr-only">Next</span>
                                        </a>
                                    </div>
                                </div>
                            </div><!-- /.modal-content -->
                        </div><!-- /.modal-dialog -->
                    </div>`;
            return html;
        }
        function doPost(form) {
            var ajax = new XMLHttpRequest();
            ajax.open("POST", "/addPost", true);
            ajax.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    alert(response.message);
                    if (response.status == "success") {
                        location.reload();
                    }
                }
            };
            var formData = new FormData();
            for (var i = 0; i < listF.length; i++) {
                formData.append("litsfile", listF[i].file);
            }
            formData.append("litsfile", video[0]);
            formData.append("caption", $('#captionpost').val());
            formData.append("type", "post");
            ajax.send(formData);
            return false;
        }
        function doEdit(form) {
            var ajax = new XMLHttpRequest();
            ajax.open("POST", "/editPost", true);
            ajax.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    var response = JSON.parse(this.responseText);
                    alert(response.message);
                    if (response.status == "success") {
                        location.reload();
                    }
                }
            };
            var formData = new FormData();
            for (var i = 0; i < imagesWill.length; i++) {
                formData.append("litsfile", imagesWill[i].file);
            }
            if (video.length > 0) {
                console.log(video[0]);
                formData.append("litsfile", video[0]);
            }
            formData.append("id_post", $(form).attr('id').split('form-post-')[1]);
            formData.append("videoState", videoState);
            formData.append("listImgDel", listImgDel);
            formData.append("caption", $(form).find("textarea").val());
            formData.append("type", "Edit");
            ajax.send(formData);
            return false;
        }
        function showNewsfeed() {
            var ajax = new XMLHttpRequest();
            ajax.open("POST", "/getNewsfeed", true);

            ajax.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    var response = JSON.parse(this.responseText);

                    var html = "";
                    for (var a = 0; a < response.data.length; a++) {
                        var data = response.data[a];

                        html += '<div class="central-meta item">';
                        html += '<div class="user-post">';
                        html += '<div class="friend-info">';

                        html += '<figure>';
                        html += '<img src="' + linkpt + '" style="width: 45px; height: 45px; object-fit: cover;">';
                        html += '</figure>';

                        html += '<div class="friend-name">';
                        html += '<ins>';

                        if (data.type == "post") {
                            html += '<a href="/user/' + data.user.username + '">';
                            html += data.user.name;
                            html += '</a>';
                        }
                        else {
                            html += data.user.name;
                        }
                        html += `<a data-toggle="modal" href="#exampleModal" class="float-right">Edit</a>`;
                        html += `<a class="float-right">Xoa</a>`;
                        html += '</ins>';

                        var createdAt = new Date(data.createdAt);
                        var date = createdAt.getDate() + "";
                        date = date.padStart(2, "0") + " " + months[createdAt.getMonth()] + ", " + createdAt.getFullYear();

                        html += '<span>Published: ' + date + '</span>';
                        html += '</div>';

                        html += '<div class="post-meta">';

                        html += '<div class="description">';
                        html += '<p>';
                        html += data.caption;
                        html += '</p>';
                        html += '</div>';

                        if (data.image.length > 0) {
                            data.image.forEach(element => {
                                html += '<img src="' + mainURL + "/" + element.image + '">';
                            });
                            //html += '<img src="' + mainURL + "/" + data.image[0].image + '">';
                        }

                        if (data.video != "") {
                            html += '<video style="height: 359px; width: 100%;" controls src="' + mainURL + "/" + data.video + '"></video>';
                        }
                        html += createLikesSection(data);
                        html += '</div>';
                        html += '</div>';
                        // begin comment
                        html += "<div id='post-comments-" + data._id + "'>";
                        html += createCommentsSection(data);
                        html += "</div>";

                        // end comment
                        html += '</div>';
                        html += '</div>';
                    }
                    document.getElementById("newsfeed").innerHTML = html;
                }
            };

            var formData = new FormData();
            ajax.send(formData);
        }
        function showNewsfeed2() {
            var ajax = new XMLHttpRequest();
            ajax.open("POST", "/getNewsfeed1", true);

            ajax.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    var response = JSON.parse(this.responseText);
                    console.log(response);

                    var html = "";
                    for (var a = 0; a < response.data.length; a++) {
                        var data = response.data[a];
                        var id_post = data._id;
                        html += '<div class="central-meta item">';
                        html += '<div class="user-post">';
                        html += '<div class="friend-info">';

                        html += '<figure>';
                        html += '<img src="' + data.user.profileImage + '" style="width: 45px; height: 45px; object-fit: cover;">';
                        html += '</figure>';

                        html += '<div class="friend-name">';
                        html += '<ins>';

                        if (data.type == "post") {
                            html += '<a href="/user/' + data.user.email + '">';
                            html += data.user.name;
                            html += '</a>';
                        }
                        else {
                            html += data.user.name;
                        }
                        if (userEmail == data.user.email) {
                            html += `<div class="float-right">
                                                <i style="padding-left:40px;" class="fas fa-ellipsis-h action-icon"></i>
                                                <ul class="action-menu">
                                                    <li class="action-menu__item">
                                                        <a style="cursor:pointer" id="btn-edit-confirm-` + id_post + `" class="btn_edit float-right btn-action">Edit</a>
                                                    </li>
                                                    <li class="action-menu__item">
                                                        <a style="cursor:pointer" id="btn-edit-toDelete-confirm-` + id_post + `" class="btn_edit_toDelete float-right btn-action">Delete</a>
                                                    </li>
                                                </ul>
                                            </div>`;
                        }

                        //html += `<a class="float-right">Xoa</a>`;
                        html += '</ins>';

                        var createdAt = new Date(data.createdAt);
                        var date = createdAt.getDate() + "";
                        date = date.padStart(2, "0") + " " + months[createdAt.getMonth()] + ", " + createdAt.getFullYear() + ", " + createdAt.toLocaleTimeString();

                        html += '<span>Published: ' + date + '</span>';
                        html += '</div>';

                        html += '<div class="post-meta">';
                        html += '<form method="post" id="form-post-' + id_post + '" onsubmit="return doEdit(this);" enctype="multipart/form-data">';
                        html += '<div class="description">';
                        html += '<p id="captionpost-' + id_post + '">';
                        html += data.caption;
                        html += '</p>';
                        html += '</div>';
                        html += '<div class="attachments">';
                        html += '<ul>';
                        html += '<li id="listimg-' + id_post + '">';
                        if (data.image.length > 0) {
                            html += `<div class = "img-container">
                                        `+ '<img id="img-preview-' + id_post + '" src="' + mainURL + "/" + data.image[0].image + '">' +
                                `<div class = "content">
                                            <div id="zoom-text-`+ id_post + `" class = "zoom-text">
                                                Click
                                            </div>
                                            <h2>Landscape One</h2>
                                        </div>
                                    </div>`

                            // data.image.forEach(element => {
                            //     html += '<img src="' + mainURL + "/" + element.image + '">';
                            // });
                            $('#Modal-').parent().append(createModalForNewsFeed(id_post, data.image));
                            var listhinh_id = '#listhinh-' + id_post + " div";
                            $(listhinh_id).first().addClass("active");
                        }
                        // else{
                        //     $('#Modal-').parent().append(createModalForNewsFeed(id_post,data.image));
                        // }
                        html += '</li>';

                        html += '<li>';
                        if (data.video != "") {
                            html += '<video class="video-preview-' + id_post + '" id="video-preview-' + id_post + '" style="height: 359px; width: 100%;" controls src="' + mainURL + "/" + data.video + '"></video>';
                        }
                        else {
                            html += '<video class="video-preview-' + id_post + '" id="video-preview-' + id_post + '" style="display: none;height: 359px; width: 100%;" controls></video>';
                        }
                        html += '</li>';
                        html += '</ul>';
                        html += '<ul id="ul-edit-' + id_post + '">';
                        html += '</ul>';
                        html += '</div>';
                        html += '</form>';
                        html += createLikesSection(data);
                        html += '</div>';
                        html += '</div>';
                        // begin comment
                        html += "<div id='post-comments-" + data._id + "'>";
                        html += createCommentsSection(data);
                        html += "</div>";
                        // end comment
                        html += '</div>';
                        html += '</div>';
                    }
                    $("#newsfeed").html(html);
                    $('.loading').removeClass('show')
                    eventEditClick();
                    eventEditoDeleteClick();
                    showDetailImages();
                }
            };

            var formData = new FormData();
            
            formData.append("otherEmail", userID);
            ajax.send(formData);
        }
        function showNewsfeed1() {
            var ajax = new XMLHttpRequest();
            ajax.open("POST", "/getNewsfeed", true);

            ajax.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    var response = JSON.parse(this.responseText);
                    console.log(response);

                    var html = "";
                    for (var a = 0; a < response.data.length; a++) {
                        var data = response.data[a];
                        var id_post = data._id;
                        html += '<div class="central-meta item">';
                        html += '<div class="user-post">';
                        html += '<div class="friend-info">';

                        html += '<figure>';
                        html += '<img src="' + data.user.profileImage + '" style="width: 45px; height: 45px; object-fit: cover;">';
                        html += '</figure>';

                        html += '<div class="friend-name">';
                        html += '<ins>';

                        if (data.type == "post") {
                            html += '<a href="/user/' + data.user.email + '">';
                            html += data.user.name;
                            html += '</a>';
                        }
                        else {
                            html += data.user.name;
                        }
                        if (userEmail == data.user.email) {
                            html += `<div class="float-right">
                                                <i style="padding-left:40px;" class="fas fa-ellipsis-h action-icon"></i>
                                                <ul class="action-menu">
                                                    <li class="action-menu__item">
                                                        <a style="cursor:pointer" id="btn-edit-confirm-` + id_post + `" class="btn_edit float-right btn-action">Edit</a>
                                                    </li>
                                                    <li class="action-menu__item">
                                                        <a style="cursor:pointer" id="btn-edit-toDelete-confirm-` + id_post + `" class="btn_edit_toDelete float-right btn-action">Delete</a>
                                                    </li>
                                                </ul>
                                            </div>`;
                        }

                        //html += `<a class="float-right">Xoa</a>`;
                        html += '</ins>';

                        var createdAt = new Date(data.createdAt);
                        var date = createdAt.getDate() + "";
                        date = date.padStart(2, "0") + " " + months[createdAt.getMonth()] + ", " + createdAt.getFullYear() + ", " + createdAt.toLocaleTimeString();

                        html += '<span>Published: ' + date + '</span>';
                        html += '</div>';

                        html += '<div class="post-meta">';
                        html += '<form method="post" id="form-post-' + id_post + '" onsubmit="return doEdit(this);" enctype="multipart/form-data">';
                        html += '<div class="description">';
                        html += '<p id="captionpost-' + id_post + '">';
                        html += data.caption;
                        html += '</p>';
                        html += '</div>';
                        html += '<div class="attachments">';
                        html += '<ul>';
                        html += '<li id="listimg-' + id_post + '">';
                        if (data.image.length > 0) {
                            html += `<div class = "img-container">
                                        `+ '<img id="img-preview-' + id_post + '" src="' + mainURL + "/" + data.image[0].image + '">' +
                                `<div class = "content">
                                            <div id="zoom-text-`+ id_post + `" class = "zoom-text">
                                                Click
                                            </div>
                                            <h2>Landscape One</h2>
                                        </div>
                                    </div>`

                            // data.image.forEach(element => {
                            //     html += '<img src="' + mainURL + "/" + element.image + '">';
                            // });
                            $('#Modal-').parent().append(createModalForNewsFeed(id_post, data.image));
                            var listhinh_id = '#listhinh-' + id_post + " div";
                            $(listhinh_id).first().addClass("active");
                        }
                        // else{
                        //     $('#Modal-').parent().append(createModalForNewsFeed(id_post,data.image));
                        // }
                        html += '</li>';

                        html += '<li>';
                        if (data.video != "") {
                            html += '<video class="video-preview-' + id_post + '" id="video-preview-' + id_post + '" style="height: 359px; width: 100%;" controls src="' + mainURL + "/" + data.video + '"></video>';
                        }
                        else {
                            html += '<video class="video-preview-' + id_post + '" id="video-preview-' + id_post + '" style="display: none;height: 359px; width: 100%;" controls></video>';
                        }
                        html += '</li>';
                        html += '</ul>';
                        html += '<ul id="ul-edit-' + id_post + '">';
                        html += '</ul>';
                        html += '</div>';
                        html += '</form>';
                        html += createLikesSection(data);
                        html += '</div>';
                        html += '</div>';
                        // begin comment
                        html += "<div id='post-comments-" + data._id + "'>";
                        html += createCommentsSection(data);
                        html += "</div>";
                        // end comment
                        html += '</div>';
                        html += '</div>';
                    }
                    $("#newsfeed").html(html);
                    $('.loading').removeClass('show')
                    eventEditClick();
                    eventEditoDeleteClick();
                    showDetailImages();
                }
            };

            var formData = new FormData();
            if (isMyPage) {
                formData.append("isMyPage", "true");
            }
            else {
                formData.append("isMyPage", "false");
            }
            formData.append("divLength",$("#newsfeed").children().length);
            ajax.send(formData);
        }
        function createCommentsSection(data) {
            var html = "";

            html += '<div class="coment-area">';
            html += '<ul class="we-comet" style="max-height: 300px; overflow-y: scroll;">';

            data.comments = data.comments.reverse();
            for (var b = 0; b < data.comments.length; b++) {
                var comment = data.comments[b];

                html += '<li>';
                html += '<div class="comet-avatar">';
                html += '<img src="' + comment.user.profileImage + '">';
                html += '</div>';

                html += '<div class="we-comment">';
                html += '<div class="coment-head">';
                html += '<h5><a href="/">' + comment.user.name + '</a></h5>';

                var createdAt = new Date(comment.createdAt);
                var date = createdAt.getDate() + "";
                date = date.padStart(2, "0") + " " + months[createdAt.getMonth()] + ", " + createdAt.getFullYear() + ", " + createdAt.toLocaleTimeString();

                html += '<span>' + date + '</span>';
                html += '<a class="we-reply" href="javascript:void(0);" data-post-id="' + data._id + '" data-comment-id="' + comment._id + '" onclick="prepareToReply(this);" title="Reply"><i class="fa fa-reply"></i></a>';
                html += '</div>';

                html += '<p>' + comment.comment + '</p>';
                html += '</div>';

                html += '<ul>';

                comment.replies = comment.replies.reverse();

                for (var c = 0; c < comment.replies.length; c++) {
                    var reply = comment.replies[c];

                    html += '<li>';
                    html += '<div class="comet-avatar">';
                    html += '<img src="' + reply.user.profileImage + '">';
                    html += '</div>';

                    html += '<div class="we-comment">';
                    html += '<div class="coment-head">';
                    html += '<h5><a href="/">' + reply.user.name + '</a></h5>';

                    var createdAt = new Date(reply.createdAt);
                    var date = createdAt.getDate() + "";
                    date = date.padStart(2, "0") + " " + months[createdAt.getMonth()] + ", " + createdAt.getFullYear() + ", " + createdAt.toLocaleTimeString();

                    html += '<span>' + date + '</span>';
                    html += '</div>';
                    html += '<p>' + reply.reply + '</p>';
                    html += '</div>';
                    html += '</li>';
                }
                html += '</ul>';

                html += '</li>';
            }
            html += '</ul>';

            html += '<ul class="we-comet">';
            html += '<li class="post-comment">';
            html += '<div class="comet-avatar">';
            html += '<img src="' + linkpt + '">';
            html += '</div>';
            html += '<div class="post-comt-box">';
            html += '<form method="post" onsubmit="return doPostComment(this);">';
            html += '<input type="hidden" name="_id" value="' + data._id + '">';
            html += '<textarea name="comment" placeholder="Post your comment"></textarea>';
            html += '<button type="submit">Post</button>';
            html += '</form>';
            html += '</div>';
            html += '</li>';
            html += '</ul>';
            html += '</div>';
            return html;
        }
        function prepareToReply(self) {
            $("#replyModal input[name='postId']").val(self.getAttribute("data-post-id"));
            $("#replyModal input[name='commentId']").val(self.getAttribute("data-comment-id"));
            $("#replyModal").modal('show');
        }
        function doPostReply(form) {
            var ajax = new XMLHttpRequest();
            ajax.open("POST", "/postReply", true);

            ajax.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    var response = JSON.parse(this.responseText);
                    alert(response.message);

                    if (response.status == "success") {
                        form.reply.value = "";
                        $("#replyModal").modal("hide");
                        var commentsHtml = createCommentsSection(response.updatePost);
                        document.getElementById("post-comments-" + form.postId.value).innerHTML = commentsHtml;
                    }
                }
            };

            var formData = new FormData(form);
            formData.append("accessToken", localStorage.getItem("accessToken"));
            ajax.send(formData);

            return false;
        }
        function doPostComment(form) {
            var ajax = new XMLHttpRequest();
            ajax.open("POST", "/postComment", true);

            ajax.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {

                    var response = JSON.parse(this.responseText);
                    alert(response.message);
                    if (response.status == "success") {
                        form.comment.value = "";
                        var commentsHtml = createCommentsSection(response.updatePost);
                        document.getElementById("post-comments-" + form._id.value).innerHTML = commentsHtml;
                        var comments = parseInt(document.getElementById("count-post-comments-" + form._id.value).innerHTML);
                        comments++;
                        document.getElementById("count-post-comments-" + form._id.value).innerHTML = comments;
                    }
                }
            };

            var formData = new FormData(form);
            ajax.send(formData);

            return false;
        }
        function createLikesSection(data) {
            localStorage.setItem("accessToken", "aaaa");
            //alert(localStorage.getItem("accessToken") + userID)

            var isLiked = false;
            var html = "";

            html += '<div class="we-video-info">';
            html += '<ul>';

            html += '<li>';

            var className = "";
            if (isLiked) {
                className = "like";
            } else {
                className = "none";
            }

            html += '</li>';

            html += '<li>';
            html += '<span class="comment" title="Comments">';
            html += '<i class="fa fa-comments-o"></i>';
            html += '<ins id="count-post-comments-' + data._id + '">' + data.comments.length + '</ins>';
            html += '</span>';
            html += '</li>';

            html += '</ul>';
            html += '</div>';

            return html;
        }
        
