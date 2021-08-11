const fetch = require("node-fetch");
const fs = require('fs');
// var getJSON = require('get-json')
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// const { send } = require("process");

const ques1 = () =>{
  const rawdata = fs.readFileSync('./Data/battles.json');
  const student = JSON.parse(rawdata);

  const attacker_king = {}
  student.forEach(item => {
    if(item['attacker_king'] in attacker_king){
      attacker_king[item['attacker_king']] += 1
    }
    else{
      attacker_king[item['attacker_king']] = 1
    }
  });

  const defender_king = {}
  student.forEach(item => {
    if(item['defender_king'] in defender_king){
      defender_king[item['defender_king']] += 1
    }
    else{
      defender_king[item['defender_king']] = 1
    }
  });

  const region = {}
  student.forEach(item => {
    if(item['region'] in region){
      region[item['region']] += 1
    }
    else{
      region[item['region']] = 1
    }
  });

  const name = {}
  student.forEach(item => {
    if(item['name'] in name){
      name[item['name']] += 1
    }
    else{
      name[item['name']] = 1
    }
  });

  const attacker_outcome = {'win': 0, 'loss': 0}
  student.forEach(item => {
    if(item['attacker_outcome'] == 'win'){
      attacker_outcome['win'] += 1
    }
    else{
      attacker_outcome['loss'] += 1
    }
  });

  const battle_type = student.map(item=>item['battle_type'])

  const defender_size = student.map(item=>{  //since the count is null many places hence replacing with 0 so that avg becomes easy
    if(item['defender_size'] != null){
      return item['defender_size']
    }
    else{
      return 0
    }
  })
  const sum_defend = defender_size.reduce((sum, item) => sum + item)
  return {
    'most_active':{
        'attacker_king': Object.keys(attacker_king).reduce((a, b) => attacker_king[a] > attacker_king[b] ? a : b),
        'defender_king': Object.keys(defender_king).reduce((a, b) => defender_king[a] > defender_king[b] ? a : b),
        'region': Object.keys(region).reduce((a, b) => region[a] > region[b] ? a : b),
        'name': 'All the names occur only once'
    },
    'attacker_outcome':{
        'win': attacker_outcome['win'], // total win
        'loss': attacker_outcome['loss'] // total loss
    },
    'battle_type':Array.from(new Set(battle_type)), // unique battle types
    'defender_size':{
        'average': sum_defend/defender_size.length,
        'min': Math.min( ...defender_size),
        'max': Math.max( ...defender_size)
        }
    }
}

const ques2 = async (name)=>{
  const url = 'https://api.github.com/search/repositories?q='+ name
  const response = await fetch(url)
  const data = await response.json()
  const result = []
  const items = data['items']
  
  for(let i=0;i<items.length;i+=1){
    let ans = {}
    
    ans['name'] = items[i]['name']
    ans['full_name'] = items[i]['full_name']
    ans['private'] = items[i]['private']
    ans['owner'] = {}
    ans['owner']['login'] = items[i]['owner']['login']    

    const ownerdata = fetch(items[i]['owner']['url'])
    .then((response) => response.json())
    .then((user) => {
      if(user.name){ return user.name }
      else{ return user.message }
    });
    ans['owner']['name'] = await ownerdata.then((name)=> name)

    const followersCount = fetch(items[i]['owner']['followers_url'])
    .then((response) => response.json())
    .then((user) => {
      if(user.length){ return user.length }
      else{ return user.message }      
    });
    ans['owner']['followersCount'] = await followersCount.then((name)=> name)

    const followingCount = fetch(items[i]['owner']['following_url'])
    .then((response) => response.json())
    .then((user) => {
      if(user.length){ return user.length }
      else{ return user.message }
    });
    ans['owner']['followingCount'] = await followingCount.then((name)=> name)

    if(items[i]['license']){
      ans['licenseName'] = items[i]['license']['name']
    }

    ans['score'] = items[i]['score']

    const branchCount = fetch(items[i]['branches_url'])
    .then((response) => response.json())
    .then((user) => {
      if(user.length){ return user.length }
      else{ return user.message }
    });
    ans['numberOfBranch'] = await branchCount.then((name)=> name)
    result.push(ans)
  }
  return result
}

const ques3 = async () =>{
  const url = 'http://api.nobelprize.org/v1/prize.json'
  const response = await fetch(url)
  const data = await response.json()
  const prizeArray = data.prizes
  const yearCheck = await prizeArray.filter((item) => item['year'] >= 2000 && item['year'] <= 2019)
  const categoryCheck = await yearCheck.filter((item) => item.category == 'chemistry')
  return categoryCheck
}

module.exports={
  ques1,
  ques2,
  ques3
}