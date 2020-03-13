const chai = require('chai');
const chaiHTTP = require('chai-http');

const server = require('../app');
const User = require('../models/User')

const should = chai.should();
const {
  expect
} = require('chai');
chai.use(chaiHTTP);

describe('users', () => {
  User.collection.drop();

  beforeEach((done) => {
    let user = new User({
      email: 'user@test.dev',
      password: '1234',
      token: ''
    })

    user.save((err) => {
      done()
    })
  });

  afterEach((done) => {
    User.collection.drop();
    done()
  })

  // register
  it('seharusnya dapat melakukan register dengan metode POST', (done) => {
    chai.request(server)
      .post('/api/users/register')
      .send({
        'email': 'piscki@test.dev',
        'password': '1234',
        'retypepassword': '1234'
      })
      .end((err, res) => {
        res.should.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('status');
        res.body.should.have.property('message');
        res.body.should.have.property('token');
        res.body.data.should.have.property('email');
        res.body.data.should.have.property('password');
        res.body.status.should.equal(true);
        res.body.message.should.equal('Register success');
        res.body.token.should.be.a('string');
        res.body.data.email.should.equal('piscki@test.dev')
        res.body.data.password.should.equal('1234');
        done()
      })
  })

  // list 
  it('seharusnya berhasil medapatkan data user melalui metode GET', (done) => {
    chai.request(server)
      .get('/api/users/list')
      .end((req, res) => {
        console.log(res)
        res.should.have.status(200);
        res.should.be.json
        res.body.should.be.a('array')
        res.body[0].should.have.property('_id');
        res.body[0].should.have.property('email');
        res.body[0].should.have.property('password');
        res.body[0].should.have.property('token');
        res.body[0].email.should.equal('user@test.dev');
        res.body[0].token.should.be.a('string');
        done();
      })
  })

  // login 
  it('seharusnya dapat melakukan authentikasi ke sistem API dengan metode POST', (done) => {
    chai.request(server)
      .post('/api/users/login')
      .send({
        'email': 'piscki@test.dev',
        'password': '1234'
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('object');
        res.body.should.have.property('_id');
        res.body.should.have.property('email');
        res.body.should.have.property('password');
        res.body.should.have.property('token');
        res.body.email.should.equal('piscki@test.dev');
        res.body.email.should.be.a('string');
        done();
      })
  })

  // check
  it('Seharusnya value berubah menjadi tru dengan metode POST', (done) => {
    chai.request(server)
      .post('/api/users/login')
      .send({
        'email': 'user@test.dev',
        'password': '1234'
      })
      .end((err, response) => {
        console.log(response);
        const token = response.body.token;
        chai.request(server)
          .post('/api/users/check')
          .set('Authorization', token)
          .end((err, res) => {
            console.log(res)
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('valid');
            res.body.valid.should.equal(true);
            done();
          })
      })
  })

  // list
  it('seharusnya dapat logout session dengan token melalui metode POST', (done) => {
    chai.request(server)
      .post('/api/users/login')
      .send({
        'email': 'user@test.dev',
        'password': '1234'
      })
      .end((err, response) => {
        const token = response.body.token;
        chai.request(server)
          .get('/api/users/destroy')
          .send('Authorization', token)
          .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('logout');
            res.body.logout.should.equal(true);
            done()
          })
      })
  })

})