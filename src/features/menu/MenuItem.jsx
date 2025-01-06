import { useDispatch, useSelector } from 'react-redux';
import Button from '../../ui/Button';
import { formatCurrency } from '../../utils/helpers';
import { addItem, getCurrentQuantityById } from '../cart/cartSlice';
import DeleteItem from '../cart/DeleteItem';
import UpdateItemQuantity from '../cart/UpdateItemQuantity';
import {  useState } from 'react';

function MenuItem({ pizza }) {
  const { id, name, unitPrice, ingredients, soldOut, imageUrl } = pizza;
  const dispatch = useDispatch();
  const currentQuantity = useSelector(getCurrentQuantityById(id));
  const isInCart = currentQuantity > 0;

  const [addIngredients, setAddIngredients] = useState([]);
  const [value, setValue] = useState('');
  const [showForm, setShowForm] = useState(false);

  function handleAddToCart() {
    const newItem = {
      pizzaId: id,
      name,
      quantity: 1,
      unitPrice,
      totalPrice: unitPrice * 1,
      addIngredients: addIngredients,
    };
    console.log(newItem);
    dispatch(addItem(newItem));
  }
  function handleAddIngredients(e) {
    e.preventDefault();
    setShowForm(false);
    if (!value) return;
    setAddIngredients((preValue) => [...preValue, value]);
    setValue('');
  }
  return (
    <li className="flex gap-4 py-2">
      <img
        src={imageUrl}
        alt={name}
        className={`h-24 ${soldOut ? 'opacity-70 grayscale' : ''}`}
      />
      <div className="flex grow flex-col pt-0.5">
        <p className="font-medium">{name}</p>
        <div className="flex items-center justify-between gap-2">
          <p className="inline-block text-sm capitalize italic text-stone-500">
            {ingredients.join(', ')}
            {addIngredients.length !== 0 && (
              <span className="text-yellow-800">
                , {addIngredients?.join(',')}
              </span>
            )}
          </p>
          {!soldOut && isInCart && (
            <div className="flex gap-2">
              <button className="h-6 w-6 rounded-full bg-stone-200 hover:bg-stone-300">
                -
              </button>
              {addIngredients.length < 3 && (
                <button
                  className="h-6 w-6 rounded-full bg-stone-200 hover:bg-stone-300"
                  onClick={() => setShowForm((preValue) => !preValue)}
                >
                  +
                </button>
              )}

              {showForm && (
                <form onSubmit={handleAddIngredients}>
                  {addIngredients.length < 3 && (
                    <input
                      type="text"
                      className="w-40 rounded-full px-3 text-sm outline-yellow-400 ring-2 ring-yellow-300"
                      placeholder="add ingredient"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    ></input>
                  )}
                </form>
              )}
              <button
                className="rounded-full bg-stone-200 p-1 text-xs hover:bg-stone-300"
                onClick={() => {
                  setAddIngredients('');
                }}
              >
                reset
              </button>
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between">
          {!soldOut ? (
            <p className="text-sm">{formatCurrency(unitPrice)}</p>
          ) : (
            <p className="text-sm font-medium uppercase text-stone-500">
              Sold out
            </p>
          )}
          {isInCart && (
            <div className="flex items-center gap-3 sm:gap-8">
              <UpdateItemQuantity
                pizzaId={id}
                currentQuantity={currentQuantity}
              />
              <DeleteItem pizzaId={id} />
            </div>
          )}
          {!soldOut && !isInCart && (
            <Button type="small" onClick={handleAddToCart}>
              Add to cart
            </Button>
          )}
        </div>
      </div>
    </li>
  );
}

export default MenuItem;
