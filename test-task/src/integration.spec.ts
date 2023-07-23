import request from 'supertest';
import { expect } from 'chai';
import { app ,server, provider } from './index';

describe('Test the Express routes', () => {

  it('GET /balance', (done) => {
    request(app)
      .get('/balance')
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('balance');
        done();
      });
  });

  it('POST /transfer', (done) => {
    request(app)
      .post('/transfer')
      .send({
        to: process.env.ACCOUNT_TO_TRANSFER!,
        amount: 10,
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('transactionHash');
        done();
      });
  });

  it('POST /transfer - should fail with 500 when parameters are missing', (done) => {
    request(app)
      .post('/transfer')
      .send({
        to: '',
        amount: '',
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(500);
        done();
      });
  });

  it('POST /transfer - should fail with 500 when sending to an invalid address', (done) => {
    request(app)
      .post('/transfer')
      .send({
        to: '0xInvalidAddress',
        amount: 10,
      })
      .end((err, res) => {
        expect(res.statusCode).to.equal(500);
        done();
      });
  });

  after((done) => {
    server.close(() => {
      provider.disconnect();
      console.log('Server closed after testing');
      done();
    });
  });
});
