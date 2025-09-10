import { prisma } from './prisma';

export async function getModerationTasks() {
	return prisma.reviewTask.findMany({
		where: { status: 'OPEN' }
	});
}

export async function claimModerationTask(taskId: string, userId: string) {
	return prisma.reviewTask.updateMany({
		where: { id: taskId, status: 'OPEN' },
		data: { status: 'CLAIMED', assigneeId: userId }
	});
}

export async function getClaimedTasks(userId: string) {
	return prisma.reviewTask.findMany({
		where: { assigneeId: userId, status: 'CLAIMED' },
		include: { post: true }
	});
}

export async function setModerationDecision(
	taskId: string,
	status: 'APPROVE' | 'REJECT',
	rationale: string,
	userId: string
) {
	const task = await prisma.reviewTask.update({
		where: { id: taskId },
		data: { status: 'RESOLVED' },
		include: { post: true }
	});

	const decision = await prisma.decision.create({
		data: {
			postId: task.postId,
			postVersion: task.postVersion,
			outcome: status,
			rationale: rationale,
			decidedBy: userId
		}
	});

	return { task, decision };
}
