const express = require('express');
const User = require('../schemas/user');
const Comment = require('../schemas/comment');
const router = express.Router();

router.route('/')
  // axios.get('/users') 로부터 요청 받음
  .get(async (req, res, next) => {
    try {
      const users = await User.find({}); // User 컬렉션 모두 가져오기
      res.json(users);
    } catch (err) {
      console.error(err);
      next(err);
    }
  })
  
  // axios.post('/users', { name, age, married }) 로부터 요청 받음
  .post(async (req, res, next) => {
    try {
      // User 컬렉션에 document 생성 & 등록
      const user = await User.create({
        name: req.body.name,
        age: req.body.age,
        married: req.body.married,
      });
      
      console.log(user);
      res.status(201).json(user);
    } catch (err) {
      console.error(err);
      next(err);
    }
  });


// 해당 User의 Comment 가져오기 라우터
router.get('/:id/comments', async (req, res, next) => {
  try {
    // req.params.id(유저 _id)를 commenter키에 인자로 주게되면, 위에서 등록한 User 스키마에서 미리 정의된 ref로 연결된 user 임베디드 도큐먼트로 변환 해준다.
    const comments = await Comment.find({ commenter: req.params.id }).populate('commenter');

    console.log(comments); // 배열로 반환
    /*
    [
      {
        // comments 다큐먼트 정보
        _id: 6192f13b4407f5881bbc3b74,
        comment: '제로 댓글입니다',
        created_at: 2020-08-30T14:07:00.000Z,
        createdAt: 2021-11-16T02:07:33.768Z

        // users 다큐먼트를 임베디드 한다.
        commenter: { 
          _id: 618dd18614694987b7eccef1,
          name: 'zero',
          age: 24,
          married: false,
          comment: '안녕하세요. 간단히 몽고디비 사용 방법에 대해 알아봅시다.',
          createdAt: 2021-11-12T02:29:26.128Z
        },
      }
    ]
    */

    res.json(comments);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;