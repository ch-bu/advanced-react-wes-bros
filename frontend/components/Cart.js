import React from 'react';
import { compose } from 'react-apollo';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { userEnhancer } from '../enhancers/enhancers';
import TakeMyMoney from './TakeMyMoney';
import formatMoney from '../lib/formatMoney';
import { UIContext } from './UIContext';
import CartItem from './CartItem';

const CartStyles = styled.div`
  padding: 20px;
  position: relative;
  background: white;
  position: fixed;
  height: 100%;
  top: 0;
  right: 0;
  width: 40%;
  min-width: 500px;
  bottom: 0;
  transform: translateX(100%);
  transition: all 0.3s;
  box-shadow: 0 0 10px 3px rgba(0, 0, 0, 0.2);
  z-index: 5;
  display: grid;
  grid-template-rows: auto 1fr auto;
  ${props => props.open && `transform: translateX(0);`};
  header {
    border-bottom: 5px solid ${props => props.theme.black};
    margin-bottom: 2rem;
    padding-bottom: 2rem;
  }
  footer {
    border-top: 10px double ${props => props.theme.black};
    margin-top: 2rem;
    padding-top: 2rem;
    display: grid;
    grid-template-columns: auto auto;
    align-items: center;
    font-size: 3rem;
    font-weight: 900;
    p {
      margin: 0;
    }
  }
`;

const CartUl = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: scroll;
`;

const Supreme = styled.h3`
  background: ${props => props.theme.red};
  color: white;
  display: inline-block;
  padding: 4px 5px;
  transform: skew(-3deg);
  margin: 0;
  font-size: 4rem;
`;

const CloseButton = styled.button`
  background: black;
  color: white;
  font-size: 3rem;
  border: 0;
  position: absolute;
  z-index: 2;
  right: 0;
`;

const Cart = props => {
  const { me } = props.currentUser;
  if (!me) return null;
  const itemCount = me.cart.length;
  const totalPrice = me.cart.reduce((tally, cartItem) => tally + cartItem.quantity * cartItem.item.price, 0);

  return (
    <UIContext>
      {context => (
        <CartStyles open={context.state.isCartOpen}>
          <header>
            <CloseButton title="close" onClick={context.toggle}>
              &times;
            </CloseButton>

            <Supreme>{me.name}'s Cart.</Supreme>
            <p>
              You have {itemCount} item{itemCount === 1 ? '' : 's'} in your cart.
            </p>
          </header>

          <CartUl>{me.cart.map(cartItem => <CartItem key={cartItem.id} cartItem={cartItem} />)}</CartUl>
          <footer>
            <p>{formatMoney(totalPrice)}</p>
            <TakeMyMoney>
              <button>Checkout</button>
            </TakeMyMoney>
          </footer>
        </CartStyles>
      )}
    </UIContext>
  );
};

Cart.propTypes = {
  currentUser: PropTypes.object.isRequired,
};

export default compose(userEnhancer)(Cart);
export { Cart };