import request from 'supertest';
import {expect} from 'chai';
//import 'dotenv/config';
import config from 'config';
import fs from 'fs';

const data = JSON.parse(fs.readFileSync('testData/petData.json', 'utf8'));
//const baseUrl = process.env.API_BASE_URL 
const baseUrl = config.get('baseUrl');

describe('Post requests to add new pet', ()=>{
    it('add a new pet ', async()=>{
        const  response = await request(baseUrl)
        .post(data.endPoints.post_addANewPet)
        .send(data.petpayload)
        .set("Acept","aplication/json");
    
    expect(response.status).to.be.equal(200);
    expect(response.body.name).to.be.equal('rex');            
    });

    it('add a new pet with incorrect format input ', async()=>{
        const response = await request(baseUrl)
          .post(data.endPoints.post_addANewPet)
          .send({
            id: "", //Id should be a number
            name: "rex",
            category: {
              id: 1,
              name: "Dogs",
            },
            photoUrls: ["string"],
            tags: [
              {
                id: 0,
                name: "string",
              },
            ],
            status: "available",
          })
          .set("Acept", "aplication/json");
    
    expect(response.status).to.be.equal(500);
    expect(response.body).to.have.property('code',500)
    expect(response.body).to.have.property('message').that.includes('There was an error processing');
    });

    it('add a new pet with invalid input ', async()=>{
        const  response = await request(baseUrl)
        .post(data.endPoints.post_addANewPet)        
        .set("Acept","aplication/json");
   
    expect(response.status).to.be.equal(400);
    expect(response.body).to.have.property('code',400)
    expect(response.body).to.have.property('message').match(/^Input error:*/);              
    });

    it('add a new pet with incorrect route/endpoint ', async()=>{
        const  response = await request(baseUrl)
        .post('/pets')
        .send(data.petpayload)
        .set("Acept","aplication/json");
    
    expect(response.status).to.be.equal(404);
    expect(response.body).to.have.property('code',404)
    expect(response.body).to.have.property('message').that.matches(/HTTP 404 not found/i);              
    });    
});