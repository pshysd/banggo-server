import app from './app';

const PORT = app.get('PORT');

app.listen(PORT, () => {
	console.log(`${PORT}번 포트에서 서버 실행중`);
	if (process.env.NODE_ENV === 'production') {
		console.log('현재 배포 모드입니다.');
	} else {
		console.log('현재 개발 모드입니다.');
	}
});
