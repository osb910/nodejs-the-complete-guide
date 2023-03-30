import ky from 'https://esm.sh/ky@0.33.3';
const deleteProduct = async btn => {
  const {value: prodId} = btn.parentNode.querySelector('[name=prodId]');
  const productElement = btn.closest('article.product-item');
  try {
      const res = await ky.delete(`/admin/delete-product/${prodId}`).json();
      !res && productElement.remove();
  } catch (err) {
      console.log(err);
  }
}

document.body.addEventListener('click', async evt => {
    const btn = evt.target.closest('.btn');
    btn && await deleteProduct(btn);
});