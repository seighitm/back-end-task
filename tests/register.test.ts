import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import 'mocha';

dotenv.config();
chai.use(chaiHttp);

const TEST_APP_URL = process.env.TEST_APP_URL;

const registerPayload = {
    email: 'user@gmail.com',
    password: 'useruser',
    name: 'useruser',
};

describe('Register Tests', () => {
    it('Register', () => {
        return chai
            .request(TEST_APP_URL)
            .post('/users/register')
            .send(registerPayload)
            .then((res) => {
                chai.expect(res.status).to.eq(200);
                const {
                    body,
                    status,
                } = res as unknown as { status: number, body: { accessToken: string, message: string } };
                chai.expect(status).to.eq(200);
                chai.expect(body).to.be.a('object');
                chai.expect(body).to.have.all.keys('accessToken');
                chai.expect(body.accessToken).to.be.a('string');
            });
    });
});
