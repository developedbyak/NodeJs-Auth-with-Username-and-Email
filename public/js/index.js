// Function to animate the number counting
function countTo(target, element) {
  const start = 0;
  const duration = 2000; // You can adjust the duration as needed
  const step = (target - start) / duration;
  let current = start;

  const timer = setInterval(function () {
    current += step;
    element.text(Math.round(current));
    if (current >= target) {
      clearInterval(timer);
      element.text(target);
    }
  }, 1);
}

// Initialize the counting effect for each section
$(".number").each(function () {
  const target = $(this).data("number");
  countTo(target, $(this));
});
