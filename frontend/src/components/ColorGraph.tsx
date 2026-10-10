import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

type ColorDataType = {
    name: string,
    main: number,
    splash: number,
}

type ColorGraphProps = {
    data: ColorDataType[];
};


const COLORS: Record<string, string> = {
    W: "#F9FAF4", // White
    U: "#4786D1", // Blue
    B: "#383838", // Black
    R: "#E64946", // Red
    G: "#3B9B62", // Green
};

export default function ColorGraph({ data }: ColorGraphProps) {
    return (
        <div style={{ width: "100%", height: Math.max(300, data.length * 45) }}>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <defs>
                        {Object.entries(COLORS).map(([color, fill]) => (
                            <pattern
                                key={color}
                                id={`splash-${color}`}
                                patternUnits="userSpaceOnUse"
                                width={6}
                                height={6}
                                patternTransform="rotate(45)"
                            >
                                <rect width={6} height={6} fill="white" />
                                <line
                                    x1={0}
                                    y1={0}
                                    x2={0}
                                    y2={6}
                                    stroke={fill}
                                    strokeWidth={3}
                                />
                            </pattern>
                        ))}
                    </defs>

                    <XAxis dataKey="name" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />

                    <Bar
                        dataKey="main"
                        name="Main color"
                        stackId="colors"
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

                            return (
                                <rect
                                    x={x}
                                    y={y}
                                    width={width}
                                    height={height}
                                    fill={COLORS[payload.name] ?? "#8884d8"}
                                />
                            );
                        }}
                    />

                    <Bar
                        dataKey="splash"
                        name="Splash color"
                        stackId="colors"
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

                            return (
                                <rect
                                    x={x}
                                    y={y}
                                    width={width}
                                    height={height}
                                    fill={`url(#splash-${payload.name})`}
                                />
                            );
                        }}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )

}