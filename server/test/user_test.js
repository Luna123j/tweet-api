const { assert, expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const users = require('../db/queries/users.js');

chai.use(chaiHttp);

describe('user routes', () => {

  describe('test POST route /users/register', () => {
    it('should return error message because user already logged in', function() {
      var agent = chai.request.agent('http://localhost:8080')
      agent
        .post('/users/login')
        .send({ username: 'rick.sandchez@gmail.com', password: 'picklerick' })
        .then((res) => {
          expect(res).to.have.session('userId');
          return agent.post('/users/register')
            .then(function(res) {
              expect(res).to.have.status(404);
              assert(res.body.message, "Already logged in");
            })
            .catch(function(err) {
              throw err;
            });
        });
      agent.close();
    });

    it('should return error message ask valid username', function() {
      return chai.request('http://localhost:8080')
        .post("/users/register")
        .send({ username: '', password: 'test' })
        .then((res) => {
          expect(res).to.have.status(404);
        })
        .catch(function(err) {
          throw err;
        })
    });

    it('should return error message ask valid password', function() {
      return chai.request('http://localhost:8080')
        .post("/users/register")
        .send({ username: 'test', password: '' })
        .then((res) => {
          expect(res).to.have.status(404);
        })
        .catch(function(err) {
          throw err;
        })
    });


    it('should return register massage', function() {
      return chai.request('http://localhost:8080')
        .post("/users/register")
        .send({ username: 'test1', password: 'test1' })
        .then((res) => {
          expect(res).to.have.status(200);
        })
        .catch(function(err) {
          throw err;
        })
    });

  })

  describe('test POST route /users/login', () => {
    
    it('should return login message if user exist', function() {
      return chai.request('http://localhost:8080')
      .post("/users/login")
      .type('form')
      .send({ username: 'test1', password: 'test1' })
      .then((res) => {
        expect(res).to.have.status(200);
        assert(res.body.message, "Success logged in");
      })
      .catch(function(err) {
        throw err;
      })
    });
    
    it('should return error message because user already logged in', function() {
      var agent = chai.request.agent('http://localhost:8080')
      agent
        .post('/users/login')
        .send({ username: 'rick.sandchez@gmail.com', password: 'picklerick' })
        .then((res) => {
          expect(res).to.have.session('userId');
          return agent.post('/users/login')
            .then(function(res) {
              expect(res).to.have.status(404);
              assert(res.body.message, "Already logged in");
            })
            .catch(function(err) {
              throw err;
            });
        });
      agent.close();
    });

    it('should return error message if user does not exist', function() {
      return chai.request('http://localhost:8080')
        .post("/users/login")
        .type('form')
        .send({ username: 'testtt', password: 'testtt' })
        .then((res) => {
          expect(res).to.have.status(404);
          assert(res.body.message, "User dose not exist")
        })
        .catch(function(err) {
          throw err;
        })

    });

    it('should return error message if user enter wrong password', function() {
      return chai.request('http://localhost:8080')
        .post("/users/login")
        .type('form')
        .send({ username: 'test', password: '123' })
        .then((res) => {
          expect(res).to.have.status(404);
          assert(res.body.message, "Wrong Password")
        })
        .catch(function(err) {
          throw err;
        })

    });
  })

  describe('test POST route /users/logout', () => {
    it('should return logout message', function() {
      return chai.request('http://localhost:8080')
        .post("/users/logout")
        .then((res) => {
          expect(res).to.have.status(200);
          assert(res.body.message, "logged out")
        })
        .catch(function(err) {
          throw err;
        })
    });

  })


})