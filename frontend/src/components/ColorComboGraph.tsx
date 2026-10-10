import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    LabelList,
} from "recharts";

type CombinationDataType = {
    name: string;
    count: number;
    colors: string[];
    winRate: number;
    gamesWon: number;
    gamesPlayed: number;
}

type ColorComboGraphProps = {
    combinationData: CombinationDataType[];
};

const COLORS: Record<string, string> = {
    W: "#F9FAF4", // White
    U: "#4786D1", // Blue
    B: "#383838", // Black
    R: "#E64946", // Red
    G: "#3B9B62", // Green
};

export default function ColorComboGraph({ combinationData }: ColorComboGraphProps) {
    return (
        <div style={{ width: "100%", height: Math.max(300, combinationData.length * 45) }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={combinationData}
                    layout="vertical"
                    margin={{ top: 10, right: 35, left: 20, bottom: 10 }}
                >
                    <CartesianGrid
                        strokeDasharray="3 3"
                        horizontal={false}
                    />

                    <XAxis
                        type="number"
                        allowDecimals={false}
                    />

                    <YAxis
                        type="category"
                        dataKey="name"
                        width={70}
                        tickFormatter={(name) => name.replaceAll("-", "")}
                    />

                    <Tooltip
                        formatter={(value) => [value, "Drafts"]}
                        labelFormatter={(label) =>
                            `Colors: ${String(label).replaceAll("-", "")}`
                        }
                    />

                    <Bar
                        dataKey="count"
                        name="Drafts"
                        barSize={24}
                        radius={[0, 4, 4, 0]}
                        shape={(props) => {
                            const { x, y, width, height, payload } = props;

                            if (
                                x == null ||
                                y == null ||
                                width == null ||
                                height == null ||
                                height === 0
                            ) {
                                return <g />;
                            }

                            const colors: string[] = payload.colors;
                            const segmentWidth = width / colors.length;

                            return (
                                <g>
                                    {colors.map((color, index) => (
                                        <rect
                                            key={`${payload.name}-${color}`}
                                            x={x + index * segmentWidth}
                                            y={y}
                                            width={segmentWidth}
                                            height={height}
                                            fill={COLORS[color] ?? "#8884d8"}
                                        />
                                    ))}
                                </g>
                            );
                        }}
                    >
                        <LabelList
                            dataKey="winRate"
                            position="right"
                            formatter={(value) => `GWR: ${Number(value).toFixed(1)}%`}
                        />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )

}