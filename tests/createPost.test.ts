import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import 'mocha';

dotenv.config();

const TEST_APP_URL = process.env.TEST_APP_URL;

let accessToken = '';

const loginPayload = {
    email: 'user@gmail.com',
    password: 'useruser',
};

chai.use(chaiHttp);
describe('Create Post Tests', () => {
    it('Login', () => {
        return chai
            .request(TEST_APP_URL)
            .post('/users/login')
            .send(loginPayload)
            .then((res) => {
                const {body} = res as unknown as { body: { accessToken: string } };
                chai.expect(res.status).to.eq(200);
                chai.expect(body).to.be.a('object');
                chai.expect(body).to.have.all.keys('accessToken');
                chai.expect(body.accessToken).to.be.a('string');
                accessToken = body.accessToken;
            });
    });
    it('Missing title', () => {
        return chai
            .request(TEST_APP_URL)
            .post('/posts')
            .set('Authorization', 'Bearer ' + accessToken)
            .send({content: 'My post content'})
            .then((res) => {
                const {body, status} = res as unknown as { status: number, body: { name: string, message: string } };
                chai.expect(status).to.eq(500);
                chai.expect(body).to.be.a('object');
                chai.expect(body).to.have.all.keys('name', 'message', 'stack');
                chai.expect(body.name).to.be.a('string');
                chai.expect(body.name).to.be.eq('ValidationError');
                chai.expect(body.message).to.be.eq('"Title" is required');
            });
    });
    it('Missing content', () => {
        return chai
            .request(TEST_APP_URL)
            .post('/posts')
            .set('Authorization', 'Bearer ' + accessToken)
            .send({title: 'Title123'})
            .then((res) => {
                const {body, status} = res as unknown as { status: number, body: { name: string, message: string } };
                chai.expect(status).to.eq(500);
                chai.expect(body).to.be.a('object');
                chai.expect(body).to.have.all.keys('name', 'message', 'stack');
                chai.expect(body.name).to.be.a('string');
                chai.expect(body.name).to.be.eq('ValidationError');
                chai.expect(body.message).to.be.eq('"Content" is required');
            });
    });
    it('Wrong title and content format', () => {
        return chai
            .request(TEST_APP_URL)
            .post('/posts')
            .set('Authorization', 'Bearer ' + accessToken)
            .send({title: 'a', content: 'b'})
            .then((res) => {
                const {body, status} = res as unknown as { status: number, body: { name: string, message: string } };
                chai.expect(status).to.eq(500);
                chai.expect(body).to.be.a('object');
                chai.expect(body).to.have.all.keys('name', 'message', 'stack');
                chai.expect(body.name).to.be.a('string');
                chai.expect(body.name).to.be.eq('ValidationError');
                chai.expect(body.message).to.be.eq('"Title" length must be at least 3 characters long. "Content" length must be at least 3 characters long');
            });
    });
});
