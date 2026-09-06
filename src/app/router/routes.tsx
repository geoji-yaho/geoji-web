import { createBrowserRouter } from "react-router";

import { BudgetOnboardingPage, LoginPage } from "@/features/auth";
import { HomePage } from "@/features/home";
import { BudgetEditPage, MyPage } from "@/features/me";
import { ExpenseCreatePage, VerdictCardPage, VerdictPage, VotePage } from "@/features/post";
import { RoomCreatePage, RoomFeedPage, RoomInfoPage, RoomJoinPage, RoomRankingPage } from "@/features/room";

import { AppLayout } from "../layouts/AppLayout";
import { RoomLayout } from "../layouts/RoomLayout";

export const router = createBrowserRouter(
	[
		{
			path: "/",
			element: <AppLayout />,
			children: [
				{ index: true, element: <HomePage /> },
				{ path: "login", element: <LoginPage /> },
				{ path: "onboarding/budget", element: <BudgetOnboardingPage /> },
				{ path: "rooms/new", element: <RoomCreatePage /> },
				{
					path: "rooms/:roomId",
					element: <RoomLayout />,
					children: [
						{ index: true, element: <RoomFeedPage /> },
						{ path: "ranking", element: <RoomRankingPage /> },
						{ path: "info", element: <RoomInfoPage /> }
					]
				},
				{ path: "invite/:code", element: <RoomJoinPage /> },
				{ path: "posts/new", element: <ExpenseCreatePage /> },
				{ path: "posts/:postId", element: <VerdictPage /> },
				{ path: "posts/:postId/card", element: <VerdictCardPage /> },
				{ path: "posts/:postId/vote", element: <VotePage /> },
				{ path: "me", element: <MyPage /> },
				{ path: "me/budget", element: <BudgetEditPage /> }
			]
		}
	],
	{ basename: import.meta.env.BASE_URL.replace(/\/$/, "") }
);
