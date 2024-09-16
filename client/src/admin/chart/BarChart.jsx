import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { fetchComments } from "../../store/commentSlice";
import { fetchProducts } from "../../store/productSlice";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const dispatch = useDispatch();
  const { comments, status: commentStatus } = useSelector(
    (state) => state.comment
  );
  const { products, status: productStatus } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    if (commentStatus === "idle") {
      dispatch(fetchComments());
    }
    if (productStatus === "idle") {
      dispatch(fetchProducts());
    }
  }, [commentStatus, productStatus, dispatch]);

  const topCommentedProducts = useMemo(() => {
    // Tạo một đối tượng để lưu số lượng bình luận của từng sản phẩm
    const commentCounts = comments.reduce((acc, comment) => {
      acc[comment.productId] = (acc[comment.productId] || 0) + 1;
      return acc;
    }, {});

    // Tạo một mảng từ các sản phẩm và số lượng bình luận của chúng
    const productsWithComments = products.map((product) => ({
      ...product,
      commentCount: commentCounts[product._id] || 0,
    }));

    // Sắp xếp các sản phẩm dựa trên số lượng bình luận giảm dần
    productsWithComments.sort((a, b) => b.commentCount - a.commentCount);

    return productsWithComments.slice(0, 3);
  }, [comments, products]);

  const data = {
    labels: topCommentedProducts.map((product) => product.name),
    datasets: [
      {
        label: "Lượt đánh giá",
        data: topCommentedProducts.map((product) => product.commentCount),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#9CE957",
          font: {
            weight: 600
          }
        }
      },
      title: {
        display: true,
        text: "Top sản phẩm có lượt tương tác cao",
        color: "#fff",
        font: {
          size: 16,
          weight: "bold",
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
};

export default DoughnutChart;
