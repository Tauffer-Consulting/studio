import { useMantineTheme } from "@mantine/styles";

const VectorIconSVG = () => {
  const theme = useMantineTheme();
  return (
    <div>
      <svg
        width="28"
        height="21"
        viewBox="0 0 28 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M25.3077 0.792453C25.3077 0.356604 24.9846 0 24.5897 0H21.7179C21.3231 0 21 0.356604 21 0.792453V16.6415H25.3077V0.792453ZM13.1026 3.96226C13.1026 3.52642 12.7795 3.16981 12.3846 3.16981H9.51282C9.11795 3.16981 8.79487 3.52642 8.79487 3.96226V16.6415H13.1026V3.96226ZM26.9231 18.6226H1.07692C0.481026 18.6226 0 19.1536 0 19.8113C0 20.4691 0.481026 21 1.07692 21H26.9231C27.519 21 28 20.4691 28 19.8113C28 19.1536 27.519 18.6226 26.9231 18.6226ZM7 9.50943C7 9.07358 6.67692 8.71698 6.28205 8.71698H3.41026C3.01538 8.71698 2.69231 9.07358 2.69231 9.50943V16.6415H7V9.50943Z"
          fill={theme.colors.accent1[0]}
        />
      </svg>
    </div>
  );
};

export default VectorIconSVG;
