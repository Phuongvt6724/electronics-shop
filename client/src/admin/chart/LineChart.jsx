import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { getAllOrdersAsync } from "../../store/orderSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = () => {
  const dispatch = useDispatch();
  const { order, status: statusOrder } = useSelector((state) => state.order);

  useEffect(() => {
    if (statusOrder === "idle") {
      dispatch(getAllOrdersAsync());
    }
  }, [statusOrder, dispatch]);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const monthlyEarnings = useMemo(() => {
    // Tạo mảng với 12 phần tử, mỗi phần tử là 0
    const earnings = new Array(currentMonth).fill(0);

    order.forEach((order) => {
      const [, month, year] = order.orderDate.split("-").map(Number);
      if (year === currentYear) {
        const orderTotal = order.items.reduce(
          (orderSum, item) => orderSum + item.price * item.quantity,
          0
        );
        earnings[month - 1] += orderTotal; // Tháng trong JavaScript bắt đầu từ 0
      }
    });

    return earnings;
  }, [order, currentYear, currentMonth]);

  const labels = useMemo(() => {
    const labelsArray = [];
    for (let i = 1; i <= currentMonth; i++) {
      labelsArray.push(`Tháng ${i}`);
    }
    return labelsArray;
  }, [currentMonth]);

  const data = {
    labels: labels,
    datasets: [
      {
        label: `Doanh thu năm ${currentYear}`,
        data: monthlyEarnings,
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,

    animations: {
      tension: {
        duration: 1000,
        easing: "linear",
        from: 1,
        to: 0,
        loop: false,
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#fff",
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
          font: {
            size: 10,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "white",
          font: {
            size: 11,
          },
        },
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
