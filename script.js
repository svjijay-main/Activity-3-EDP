// --- REQUIRED TOP-LEVEL CALCULATION FUNCTIONS ---

function calculateItemAmount(price, quantity) {
  return price * quantity;
}

function calculateDiscount(subtotal) {
  if (subtotal >= 5000) {
    return subtotal * 0.10;
  } else if (subtotal >= 3000) {
    return subtotal * 0.07;
  } else if (subtotal >= 1000) {
    return subtotal * 0.05;
  } else {
    return 0;
  }
}

function getDeliveryFee(option) {
  switch (String(option)) {
    case '1':
      return 0;
    case '2':
      return 80;
    case '3':
      return 150;
    default:
      return 0;
  }
}

// --- HELPER FUNCTION FOR DISPLAY LABELS ---

function getDeliveryTypeName(option) {
  switch (String(option)) {
    case '1':
      return 'Store Pickup';
    case '2':
      return 'Standard Delivery';
    case '3':
      return 'Express Delivery';
    default:
      return 'Unknown';
  }
}

function getDiscountRatePercentage(subtotal) {
  if (subtotal >= 5000) return '10%';
  if (subtotal >= 3000) return '7%';
  if (subtotal >= 1000) return '5%';
  return '0%';
}

// --- DOM GENERATION & EVENT LISTENERS ---

function generateProductFields() {
  const container = document.getElementById('productsContainer');
  const count = parseInt(document.getElementById('productCount').value, 10);
  container.innerHTML = '';

  if (isNaN(count) || count <= 0) return;

  for (let i = 0; i < count; i++) {
    const productDiv = document.createElement('div');
    productDiv.className = 'product-row';
    productDiv.innerHTML = `
      <h3>Product ${i + 1}</h3>
      <div class="form-group">
        <label for="productName-${i}">Product Name</label>
        <input type="text" id="productName-${i}">
      </div>
      <div class="form-group">
        <label for="productPrice-${i}">Price</label>
        <input type="number" step="0.01" id="productPrice-${i}">
      </div>
      <div class="form-group">
        <label for="productQuantity-${i}">Quantity</label>
        <input type="number" id="productQuantity-${i}">
      </div>
    `;
    container.appendChild(productDiv);
  }
}

document.getElementById('calculateBtn').addEventListener('click', function () {
  const validationMsg = document.getElementById('validationMessage');
  const orderSummary = document.getElementById('orderSummary');

  // Clear previous outputs
  validationMsg.textContent = '';
  orderSummary.textContent = '';

  const customerName = document.getElementById('customerName').value.trim();
  const productCountInput = document.getElementById('productCount').value;
  const productCount = parseInt(productCountInput, 10);
  const deliveryOption = document.getElementById('deliveryOption').value;

  // --- VALIDATIONS ---
  if (!customerName) {
    validationMsg.textContent = 'Please enter a valid Customer Name.';
    return;
  }

  if (isNaN(productCount) || productCount <= 0) {
    validationMsg.textContent = 'Please enter a valid Number of Products.';
    return;
  }

  if (!deliveryOption || !['1', '2', '3'].includes(deliveryOption)) {
    validationMsg.textContent = 'Please select a valid Delivery Option.';
    return;
  }

  let subtotal = 0;
  let productDetailsText = '';

  // Processing products dynamically
  for (let i = 0; i < productCount; i++) {
    const nameEl = document.getElementById(`productName-${i}`);
    const priceEl = document.getElementById(`productPrice-${i}`);
    const qtyEl = document.getElementById(`productQuantity-${i}`);

    if (!nameEl || !priceEl || !qtyEl) {
      validationMsg.textContent = 'Please complete all product input fields.';
      return;
    }

    const pName = nameEl.value.trim();
    const pPrice = parseFloat(priceEl.value);
    const pQuantity = parseInt(qtyEl.value, 10);

    if (!pName) {
      validationMsg.textContent = `Please enter a valid Product Name for Item #${i + 1}.`;
      return;
    }

    if (isNaN(pPrice) || pPrice <= 0) {
      validationMsg.textContent = `Please enter a valid positive Price for Item #${i + 1}.`;
      return;
    }

    if (isNaN(pQuantity) || pQuantity <= 0) {
      validationMsg.textContent = `Please enter a valid positive Quantity for Item #${i + 1}.`;
      return;
    }

    const itemAmount = calculateItemAmount(pPrice, pQuantity);
    subtotal += itemAmount;

    productDetailsText += `${i + 1}. ${pName}\n`;
    productDetailsText += `   Price: ₱${pPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
    productDetailsText += `   Quantity: ${pQuantity}\n`;
    productDetailsText += `   Amount: ₱${itemAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n`;
  }

  // --- CALCULATIONS ---
  const discountAmount = calculateDiscount(subtotal);
  const deliveryFee = getDeliveryFee(deliveryOption);
  const finalAmount = subtotal - discountAmount + deliveryFee;

  const discountRateStr = getDiscountRatePercentage(subtotal);
  const deliveryTypeName = getDeliveryTypeName(deliveryOption);

  // --- ORDER SUMMARY DISPLAY ---
  let summaryOutput = `MINI STORE CHECKOUT SYSTEM\n\n`;
  summaryOutput += `Customer: ${customerName}\n\n`;
  summaryOutput += productDetailsText;
  summaryOutput += `ORDER SUMMARY\n`;
  summaryOutput += `Subtotal: ₱${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
  summaryOutput += `Discount Rate: ${discountRateStr}\n`;
  summaryOutput += `Discount Amount: ₱${discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
  summaryOutput += `Delivery Type: ${deliveryTypeName}\n`;
  summaryOutput += `Delivery Fee: ₱${deliveryFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
  summaryOutput += `Final Amount: ₱${finalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  orderSummary.textContent = summaryOutput;
});