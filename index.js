const schedule = require('node-schedule-tz');
const client = require('./src/client');


const generalChannelId = 'CDDG7SFH8';
const testChannelId = 'CDEJ032UX';
const randomChannelId = 'CDDG7SFQA';


// 금요일 7시
const friday = schedule.scheduleJob('0 19 * * 5', 'Asia/Seoul', () => {
  const text = '금요일 7시 입니다 :rocket: 한주도 수고 많으셨습니다.';
  client.sendMessage(text, generalChannelId);
});

// 월-금 점심
const lunchTime = schedule.scheduleJob('30 12 * * 1-5', 'Asia/Seoul', () => {
  const userIds = Array.from(client.activeUsers);
  if (userIds.length < 1) return;

  const r = Math.floor(Math.random() * userIds.length);
  const randomUserId = userIds[r];

  const text = `:rice: :rice: :rice: 오늘 점심 메뉴는 <@${randomUserId}>님이 골라 보는건 어떨까요?`;
  client.sendMessage(text, randomChannelId);
});
