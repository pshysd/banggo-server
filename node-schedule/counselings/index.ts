import { GoogleGenerativeAI } from '@google/generative-ai';
import { Op } from 'sequelize';
import Category from '../../models/category';
import Counseling from '../../models/counseling';
import Problem from '../../models/problem';
import Solution from '../../models/solution';
import dayjs from 'dayjs';

const geminiRequestTask = async () => {
	// ai 답변 안받은 counselings 가져옴 counseling[]
	const counselings = await Counseling.findAll({
		where: {
			AIAnswer: { [Op.eq]: null },
		},
		attributes: ['id', 'title', 'createdAt'],
		include: [
			{
				model: Problem,
				attributes: ['description'],
			},
			{
				model: Solution,
				attributes: ['description'],
			},
			{
				model: Category,
				attributes: ['name'],
			},
		],
	});

	if (counselings.length === 5 || counselings.some((counseling) => dayjs().diff(dayjs(counseling.createdAt), 'minute') >= 10)) {
		const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY!);

		const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

		const prompts = counselings.map((counseling) => {
			return `안녕하세요. 저는 도움이 필요한 한국인 내담자이고, 당신은 Gemini AI 서비스가 아닌 제가 도움이나 조언이 필요할 때 찾는 한 명의 상담사입니다. 당신은 한국어로 답변을 해야합니다. 상담을 진행하겠습니다.
		제가 조언이 필요한 문제의 분야는 ${counseling.Category?.name} 입니다.
		제가 고민하고 있는 문제를 한마디로 정의하자면 ${counseling.title} 입니다.
		제가 겪고있는 문제는 ${counseling.Problems?.map((problem, index) => {
			return `${index + 1}. ${problem.description} 입니다.`;
		})}
		이 문제들을 해결하기 위해 제가 떠올린 해결방안은 ${counseling.Solutions?.map((solution, index) => {
			return `${index + 1}. ${solution.description} 입니다.`;
		})}
	
		지금까지 제가 갖고있는 문제사항과 해결방안을 말씀드렸습니다. 해결방안을 더 구체화 해주시거나 더 나은 해결방안, 조언이 필요합니다`;
		});

		try {
			const result = prompts.map((prompt) => model.generateContent(prompt));
			const AIRequest = await Promise.allSettled(result);
			let texts: string[] = [];
			if (AIRequest) {
				AIRequest.map((response) => {
					if (response.status === 'fulfilled') {
						texts.push(response.value.response.text());
					}
				});
			}

			const updatePromises = texts.map((text, i) => {
				const counselingId = counselings[i].id;
				return Counseling.update({ AIAnswer: text }, { where: { id: counselingId } });
			});

			await Promise.allSettled(updatePromises);
		} catch (e) {
			const err = e as Error;
			err.status = 400;
			console.error(err);
		}
	}
};

export { geminiRequestTask };
