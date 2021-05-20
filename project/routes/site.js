const express = require('express');
const router = express.Router();
const mongodb = require("mongodb");
var multer = require('multer');
var fileSystem = require("fs");
const ObjectId = mongodb.ObjectId;
const secured = (req, res, next) => {
  if (req.user) {
    return next();
  }
  res.redirect("/login");
};
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    if (file.mimetype.startsWith('image/')) {
      callback(null, 'public/images');
    }
    else if (file.mimetype.startsWith('video/')) {
      callback(null, 'public/videos');
    }
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});
var upload = multer({ storage: storage });
router.post("/uploadCoverPhoto", upload.any("litsfile"), function (request, result) {
  var coverPhoto = "";
  var listFile = request.files
  console.log(listFile)
  var image = '';
  request.app.db.collection("users").findOne({
    "email": request.user.email
  }, function (error, user) {
    if (user == null) {
      result.json({
        "status": "error",
        "message": "User has been logged out. Please login again."
      });
    } else {

      if (listFile[0].size > 0 && listFile[0].mimetype.includes("image")) {

        if (user.coverPhoto) {
          image = "/images/" + listFile[0].originalname;

          // Read the file

          request.app.db.collection("users").updateOne({
            "email": request.user.email
          }, {
            $set: {
              "coverPhoto": image
            }
          }, function (error, data) {
            result.json({
              "status": "status",
              "message": "Cover photo has been updated.",
              data: image
            });
          }
          );
        } else {
          image = "/images/" + listFile[0].originalname;

          // Read the file

          request.app.db.collection("users").updateOne({
            "email": request.user.email
          }, {
            $push: {
              "coverPhoto": image
            }
          }, function (error, data) {
            result.json({
              "status": "status",
              "message": "Cover photo has been updated.",
              data: image
            });
          }
          );
        }
      }
    };
  });
});
router.post("/uploadProfileImage", upload.any("litsfile"), function (request, result) {
  var listFile = request.files
  var image = '';
  request.app.db.collection("users").findOne({
    "email": request.user.email
  }, function (error, user) {
    if (user == null) {
      result.json({
        "status": "error",
        "message": "User has been logged out. Please login again."
      });
    } else {

      if (listFile[0].size > 0 && listFile[0].mimetype.includes("image")) {

        image = "/images/" + listFile[0].originalname;

        // Read the file

        request.app.db.collection("users").updateOne({
          "email": request.user.email
        }, {
          $set: {
            "picture": image
          }
        }, function (error, data) {
          request.app.db.collection("posts").updateMany({
            "user.email": request.user.email
          }, {
            $set: {
              "user.profileImage": image
            }
          }, () => {
            request.app.db.collection("posts").updateMany({
              "comments.user.email": request.user.email
            }, {
              $set: { "comments.$[i].user.profileImage": image }
            }, {
              arrayFilters: [{ "i.user.email": request.user.email }]
            }, () => {
              request.app.db.collection("posts").updateMany({
                "comments.replies.user.email": request.user.email
              }, {
                $set: { "comments.$[].replies.$[i].user.profileImage": image }
              }, {
                arrayFilters: [{ "i.user.email": request.user.email }]
              });
              result.json({
                "status": "status",
                "message": "ImageProfiles photo has been updated.",
                data: image
              });
            });

          });
        }
        );
      }
    };
  });
});
router.post("/uploadProfileImage/update", upload.any("litsfile"), function (request, result) {
  console.log(request.body)
  request.app.db.collection("users").updateOne({
    "email": request.user.email
  }, {
    $set: {
      "name": request.body.name,
      "sn": request.body.sn,
      "city": request.body.city,
      "aboutme": request.body.aboutMe
    }
  }, () => {
    result.redirect('back')
  });
});
router.get('/myProfile/:email', secured, (req, res) => {
  var emailUser = req.params.email
  req.app.db.collection("notifications").find({
  }
  ).sort({
    "createdAt": -1
  }).limit(3).toArray((err, rel) => {
    req.app.db.collection("users").findOne({
      "email": req.user.email
    }, (err, users) => {
      if (!err) {
        console.log(users)
        res.render('updateProfile', { isMyPage: true, user: users, role: req.user.role, userID: req.user.email, poss: rel })
      }
    });
  })
})
router.get('/homePage', secured, (req, res) => {
  req.app.db.collection("notifications").find({
  }
  ).sort({
    "createdAt": -1
  }).limit(3).toArray((err, rel) => {
    req.app.db.collection("users").findOne({
      "email": req.user.email
    }, (err, users) => {
      res.render('index', { isMyPage: true, user: users, role: req.user.role, userID: req.user.email, poss: rel })
    });
  })
})
router.get('/user/:email', secured, (req, res) => {
  req.app.db.collection("notifications").find({
  }
  ).sort({
    "createdAt": -1
  }).limit(5).toArray((err, rel) => {
    req.app.db.collection("users").findOne({
      "email": req.user.email
    }, (err, users) => {
      req.app.db.collection("users").findOne({
        "email": req.params.email
      },(err,other) => {
        res.render('index', { isMyPage: false,otherUser: other, user: users, role: req.user.role, userID: req.params.email, poss: rel })
      });
      
    });
  })
})
router.get('/home', secured, (req, res) => {
  const { role } = req.user;
  console.log(req.user)
  req.app.db.collection("notifications").find({
  }
  ).sort({
    "createdAt": -1
  }).limit(3).toArray((err, rel) => {
    req.app.db.collection("users").findOne({
      "email": req.user.email
    }, (err, users) => {
      switch (role) {
        case 'student':
          res.render('index', { isMyPage: null, user: users, role: role, userID: req.user.email, poss: rel });
          break;
        case 'admin':
          res.render('index', { isMyPage: null, role: role, user: users, userID: req.user.email, poss: rel });
          break;
        default:
          res.render('index', { isMyPage: null, role: role, user: users, userID: req.user.email, poss: rel });
          break;
      }
    });
  });
})
router.post("/removePost", upload.any("litsfile"), function (request, result, err) {
  var id = request.body.id;
  console.log(id)
  request.app.db.collection("posts").findOne({
    "_id": ObjectId(id)
  }, (err, post) => {
    if (!err) {
      request.app.db.collection("users").updateOne({
        $and: [{
          "email": post.user.email
        }, {
          "posts._id": post._id
        }]
      }, {
        $pull: {
          "posts": {
            "_id": ObjectId(id)
          }
        }
      }, (err, user) => {
        if (!err) {
          request.app.db.collection("posts").remove({
            "_id": ObjectId(id)
          });
        }
        result.json({
          "status": "success",
          "message": "Post has been Deleted."
        });
      });
    }
  });
});
router.post("/addPost", upload.any("litsfile"), function (request, result, err) {
  console.log(request.files)
  var listFile = request.files
  var caption = request.body["caption"];
  var images = [];
  var video = "";
  var type = request.body["type"];
  var createdAt = new Date().getTime();
  //var _id = request.body["_id"];
  for (var i = 0; i < listFile.length; i++) {
    if (listFile[i].size > 0 && listFile[i].mimetype.includes("image")) {
      image = "/images/" + listFile[i].originalname;
      images.push({
        id: "image" + i,
        image: image
      })
    }
    if (listFile[i].size > 0 && listFile[i].mimetype.includes("video")) {
      video = "/videos/" + listFile[i].originalname;
    }
  }

  request.app.db.collection("users").findOne({
    "email": request.user.email
  }, function (error, user) {
    if (user == null) {
      result.json({
        "status": "error",
        "message": "User has been logged out. Please login again."
      });
    } else {
      request.app.db.collection("posts").insertOne({
        "caption": caption,
        "image": images,
        "video": video,
        "type": type,
        "createdAt": createdAt,
        "likers": [],
        "comments": [],
        "shares": [],
        "user": {
          "email": user.email,
          "name": user.name,
          "role": user.role,
          "profileImage": user.picture
        }
      }, function (error, data) {

        request.app.db.collection("users").updateOne({
          "email": request.user.email
        }, {
          $push: {
            "posts": {
              "_id": data.insertedId
            }
          }
        }, function (error, data) {

          result.json({
            "status": "success",
            "message": "Post has been uploaded."
          });
        });
      });
    }
  });
});
router.post("/editPost", upload.any("litsfile"), function (request, result, err) {
  console.log(request.body)
  console.log(request.files)
  var end_id = 0;
  var listFile = request.files
  var id_post = request.body["id_post"];
  var caption = request.body["caption"];
  var listImgDel = request.body["listImgDel"].split(',');
  console.log(listImgDel);
  var videoState = request.body["videoState"];
  var video = "";
  var images = [];
  var type = request.body["type"];
  var createdAt = new Date().getTime();
  //var _id = request.body["_id"];

  console.log(images)

  request.app.db.collection("users").findOne({
    "email": request.user.email
  }, function (error, user) {
    if (user == null) {
      result.json({
        "status": "error",
        "message": "User has been logged out. Please login again."
      });
    } else {
      request.app.db.collection("posts").findOneAndUpdate({
        "_id": mongodb.ObjectID(id_post)
      }, {
        $pull: {
          "image": {
            id: {
              $in: listImgDel
            }
          }
        }
      }, { returnOriginal: false }, function (err, post) {
        if (!err) {
          if (videoState == '') {
            video = post.value.video;
          }
          if (post.value.image.length != 0) {
            end_id = parseInt(post.value.image.slice(-1)[0].id.split('image')[1]) + 1;
          }
          for (var i = 0; i < listFile.length; i++) {
            if (listFile[i].size > 0 && listFile[i].mimetype.includes("image")) {
              image = "/images/" + listFile[i].originalname;
              images.push({
                id: "image" + (end_id + i),
                image: image
              })
            }
            if (listFile[i].size > 0 && listFile[i].mimetype.includes("video")) {
              video = "/videos/" + listFile[i].originalname;
            }
          }
          request.app.db.collection("posts").updateOne({
            "_id": mongodb.ObjectID(id_post)
          }, {
            $push: {
              "image": {
                $each: images
              }
            },
            $set: {
              "video": video,
              "caption": caption,
              "type": type
            }
          }, function (err, post) {
            result.json({
              "status": "success",
              "message": "Post has been uploaded."
            });
          });
        }
      });

    }
  });
});
router.post("/toggleLikePost", function (request, result) {
  console.log(request)
  var _id = request.fields._id;

  request.app.db.collection("users").findOne({
    "email": request.user.email
  }, function (error, user) {
    if (user == null) {
      result.json({
        "status": "error",
        "message": "User has been logged out. Please login again."
      });
    } else {

      request.app.db.collection("posts").findOne({
        "_id": ObjectId(_id)
      }, function (error, post) {
        if (post == null) {
          result.json({
            "status": "error",
            "message": "Post does not exist."
          });
        } else {

          var isLiked = false;
          for (var a = 0; a < post.likers.length; a++) {
            var liker = post.likers[a];

            if (liker._id.toString() == user._id.toString()) {
              isLiked = true;
              break;
            }
          }

          if (isLiked) {
            request.app.db.collection("posts").updateOne({
              "_id": ObjectId(_id)
            }, {
              $pull: {
                "likers": {
                  "_id": user._id,
                }
              }
            }, function (error, data) {

              request.app.db.collection("users").updateOne({
                $and: [{
                  "_id": post.user._id
                }, {
                  "posts._id": post._id
                }]
              }, {
                $pull: {
                  "posts.$[].likers": {
                    "_id": user._id,
                  }
                }
              });

              result.json({
                "status": "unliked",
                "message": "Post has been unliked."
              });
            });
          } else {

            request.app.db.collection("users").updateOne({
              "_id": post.user._id
            }, {
              $push: {
                "notifications": {
                  "_id": ObjectId(),
                  "type": "photo_liked",
                  "content": user.name + " has liked your post.",
                  "profileImage": user.profileImage,
                  "isRead": false,
                  "post": {
                    "_id": post._id
                  },
                  "createdAt": new Date().getTime()
                }
              }
            });

            request.app.db.collection("posts").updateOne({
              "_id": ObjectId(_id)
            }, {
              $push: {
                "likers": {
                  "_id": user._id,
                  "name": user.name,
                  "profileImage": user.profileImage
                }
              }
            }, function (error, data) {

              request.app.db.collection("users").updateOne({
                $and: [{
                  "_id": post.user._id
                }, {
                  "posts._id": post._id
                }]
              }, {
                $push: {
                  "posts.$[].likers": {
                    "_id": user._id,
                    "name": user.name,
                    "profileImage": user.profileImage
                  }
                }
              });

              result.json({
                "status": "success",
                "message": "Post has been liked."
              });
            });
          }

        }
      });

    }
  });
});
router.post("/postComment", upload.any("litsfile"), function (request, result) {
  console.log(request.body)
  var _id = request.body._id;
  var comment = request.body.comment;
  var createdAt = new Date().getTime();

  request.app.db.collection("users").findOne({
    "email": request.user.email
  }, function (error, user) {
    if (user == null) {
      result.json({
        "status": "error",
        "message": "User has been logged out. Please login again."
      });
    } else {

      request.app.db.collection("posts").findOne({
        "_id": ObjectId(_id)
      }, function (error, post) {
        if (post == null) {
          result.json({
            "status": "error",
            "message": "Post does not exist."
          });
        } else {

          var commentId = ObjectId();

          request.app.db.collection("posts").updateOne({
            "_id": ObjectId(_id)
          }, {
            $push: {
              "comments": {
                "_id": commentId,
                "user": {
                  "email": user.email,
                  "name": user.name,
                  "profileImage": user.picture,
                },
                "comment": comment,
                "createdAt": createdAt,
                "replies": []
              }
            }
          }, function (error, data) {

            if (user.email != post.user.email) {
              request.app.db.collection("users").updateOne({
                "email": post.user.email
              }, {
                $push: {
                  "notifications": {
                    "_id": ObjectId(),
                    "type": "new_comment",
                    "content": user.name + " commented on your post.",
                    "profileImage": user.picture,
                    // "post": {
                    //   "_id": post._id
                    // },
                    // "isRead": false,
                    "createdAt": new Date().getTime()
                  }
                }
              });
            }

            // request.app.db.collection("users").updateOne({
            //   $and: [{
            //     "email": post.user.email
            //   }, {
            //     "posts._id": post._id
            //   }]
            // }, {
            //   $push: {
            //     "posts.$[].comments": {
            //       "_id": commentId,
            //       "user": {
            //         "email": user.email,
            //         "name": user.name,
            //         "profileImage": user.picture,
            //       },
            //       "comment": comment,
            //       "createdAt": createdAt,
            //       "replies": []
            //     }
            //   }
            // });

            request.app.db.collection("posts").findOne({
              "_id": ObjectId(_id)
            }, function (error, updatePost) {
              result.json({
                "status": "success",
                "message": "Comment has been posted.",
                "updatePost": updatePost
              });
            });
          });

        }
      });
    }
  });
});
router.post("/getNewsfeed", upload.any("litsfile"), function (request, result) {
  console.log(request.body)
  request.app.db.collection("users").aggregate([{ $sample: { size: 5 } }]).toArray((err, rel) => {
    var emails = [];
    if (request.body.isMyPage == "true") {
      emails.push(request.user.email);
    }
    else {
      for (var i = 0; i < rel.length; i++) {
        emails.push(rel[i].email);
      }
    }
    console.log(request.body.isMyPage)
    console.log(emails)
    request.app.db.collection("posts")
      .find({
        "user.email": {
          $in: emails
        }
      })
      .sort({
        "createdAt": -1
      })
      .limit(5)
      .toArray(function (error, data) {
        result.json({
          "status": "success",
          "message": "Record has been fetched",
          "data": data
        });
      });
  });

  // request.app.db.collection("users").findOne({
  //   "email": request.user.email
  // }, function (error, user) {
  //   if (user == null) {
  //     result.json({
  //       "status": "error",
  //       "message": "User has been logged out. Please login again."
  //     });
  //   } else {

  //     var emails = [];
  //     emails.push(user.email);

  //     request.app.db.collection("posts")
  //       .find({
  //         "user.email": {
  //           $in: emails
  //         }
  //       })
  //       .sort({
  //         "createdAt": -1
  //       })
  //       .limit(5)
  //       .toArray(function (error, data) {

  //         result.json({
  //           "status": "success",
  //           "message": "Record has been fetched",
  //           "data": data
  //         });
  //       });
  //   }
  // });
});
router.post("/getNewsfeed1", upload.any("litsfile"), function (request, result) {
  console.log(request.body)
  request.app.db.collection("users").aggregate([{ $sample: { size: 5 } }]).toArray((err, rel) => {
    var emails = [];

      emails.push(request.body.otherEmail);
    console.log(emails)
    request.app.db.collection("posts")
      .find({
        "user.email": {
          $in: emails
        }
      })
      .sort({
        "createdAt": -1
      })
      .limit(5)
      .toArray(function (error, data) {
        result.json({
          "status": "success",
          "message": "Record has been fetched",
          "data": data
        });
      });
  });

  // request.app.db.collection("users").findOne({
  //   "email": request.user.email
  // }, function (error, user) {
  //   if (user == null) {
  //     result.json({
  //       "status": "error",
  //       "message": "User has been logged out. Please login again."
  //     });
  //   } else {

  //     var emails = [];
  //     emails.push(user.email);

  //     request.app.db.collection("posts")
  //       .find({
  //         "user.email": {
  //           $in: emails
  //         }
  //       })
  //       .sort({
  //         "createdAt": -1
  //       })
  //       .limit(5)
  //       .toArray(function (error, data) {

  //         result.json({
  //           "status": "success",
  //           "message": "Record has been fetched",
  //           "data": data
  //         });
  //       });
  //   }
  // });
});
router.post("/postReply", upload.any("litsfile"), function (request, result) {

  var postId = request.body.postId;
  var commentId = request.body.commentId;
  var reply = request.body.reply;
  var createdAt = new Date().getTime();

  request.app.db.collection("users").findOne({
    "email": request.user.email
  }, function (error, user) {
    if (user == null) {
      result.json({
        "status": "error",
        "message": "User has been logged out. Please login again."
      });
    } else {

      request.app.db.collection("posts").findOne({
        "_id": ObjectId(postId)
      }, function (error, post) {
        if (post == null) {
          result.json({
            "status": "error",
            "message": "Post does not exist."
          });
        } else {

          var replyId = ObjectId();

          request.app.db.collection("posts").updateOne({
            $and: [{
              "_id": ObjectId(postId)
            }, {
              "comments._id": ObjectId(commentId)
            }]
          }, {
            $push: {
              "comments.$.replies": {
                "_id": replyId,
                "user": {
                  "email": user.email,
                  "name": user.name,
                  "profileImage": user.picture,
                },
                "reply": reply,
                "createdAt": createdAt
              }
            }
          }, function (error, data) {

            // request.app.db.collection("users").updateOne({
            //   $and: [{
            //     "_id": post.user._id
            //   }, {
            //     "posts._id": post._id
            //   }, {
            //     "posts.comments._id": ObjectId(commentId)
            //   }]
            // }, {
            //   $push: {
            //     "posts.$[].comments.$[].replies": {
            //       "_id": replyId,
            //       "user": {
            //         "_id": user._id,
            //         "name": user.name,
            //         "profileImage": user.picture,
            //       },
            //       "reply": reply,
            //       "createdAt": createdAt
            //     }
            //   }
            // });

            request.app.db.collection("posts").findOne({
              "_id": ObjectId(postId)
            }, function (error, updatePost) {
              result.json({
                "status": "success",
                "message": "Reply has been posted.",
                "updatePost": updatePost
              });
            });
          });

        }
      });
    }
  });
});

module.exports = router