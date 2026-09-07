type RoomRuleListProps = {
	rules: string[];
};

export function RoomRuleList({ rules }: RoomRuleListProps) {
	return (
		<ol className="list-inside list-decimal text-body text-text">
			{rules.map((rule) => (
				<li key={rule}>{rule}</li>
			))}
		</ol>
	);
}
