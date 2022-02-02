import {useState, useEffect, useRef} from 'react';
// import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';

import './comicsList.scss';
// import uw from '../../resources/img/UW.png';
// import xMen from '../../resources/img/x-men.png';

const ComicsList = () => {

    const [comicsList, setComicsList] = useState([]);
    const [newItemLoading, setNewItemLoading] = useState(false);
    const [offset, setOffset] = useState(210);
    const [comicsEnded, setComicsEnded] = useState(false);
    
    const {loading, error, getAllComics} = useMarvelService(); // деструктуризация объекта, который создает хук useMarvelService

    useEffect(() => {
        onRequest(offset, true);
    }, [])  // useEffect запускается после рендера, функции уже существуют, поэтому можно записать его где угодно, даже выше функции

    const onRequest = (offset, initial) => { // агрумент initial нужен, чтобы в зависимости от того, true он или false, устанавливался setNewItemLoading и при дозагрузке новых комиксов по кнопке не перерисовывались заново все уже загруженные в компоненте (если просто setNewItemLoading(true), то перезагружается каждый раз весь список). Становится true только при первичной загрузке, передается в onRequest
        initial ? setNewItemLoading(false) : setNewItemLoading(true);
        getAllComics(offset)
            .then(onComicsListLoaded)
    }

    const onComicsListLoaded = (newComicsList) => {
        let ended = false;
        if (newComicsList.length < 8) {
            ended = true;
        }

        setComicsList(comicsList => [...comicsList, ...newComicsList]);  // это callback функция, возвращается новый массив
        setNewItemLoading(false);
        setOffset(offset => offset + 8);
        setComicsEnded(ended);
    }

    const itemRefs = useRef([]);

    // const focusOnItem = (id) => {
    //     itemRefs.current.forEach(item => item.classList.remove('char__item_selected'));
    //     itemRefs.current[id].classList.add('char__item_selected');
    //     itemRefs.current[id].focus();
    // }

    function renderItems(arr) {
        const items =  arr.map((item, i) => {
            // let imgStyle = {'objectFit' : 'cover'};
            // if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
            //     imgStyle = {'objectFit' : 'unset'};
            // }
            
            return (
                <li 
                    className="comics__item"
                    tabIndex={0}   // для доступа с клавиатуры
                    ref={el => itemRefs.current[i] = el}  // callback, который принимает в себя аргументом тот элемент, на котором вызван; el - ссылка на DOM элемент; itemRefs.current - массив этих ссылок
                    key={i}
                    // onClick={() => {
                    //     props.onCharSelected(item.id);
                    //     focusOnItem(i);
                    // }}
                    // onKeyPress={(e) => {
                    //     if (e.key === ' ' || e.key === "Enter") {
                    //         props.onCharSelected(item.id);
                    //         focusOnItem(i);
                    //     }
                    // }}
                    >
                        <a href="#">
                            <img src={item.thumbnail} alt={item.title} className="comics__item-img"/>
                            <div className="comics__item-name">{item.title}</div>
                            <div className="comics__item-price">{item.price}</div>
                        </a>
                </li>
            )
        });

        return (
            <ul className="comics__grid">
                {items}
            </ul>
        )
    }
    
    const items = renderItems(comicsList);

    const errorMessage = error ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner/> : null;  // идет загрузка, но это не подгрузка новых комиксов по кнопке, тогда спиннер

    return (
        <div className="comics__list">
            {errorMessage}
            {spinner}
            {items}
            <button 
                className="button button__main button__long"
                disabled={newItemLoading}
                style={{'display': comicsEnded ? 'none' : 'block'}}
                onClick={() => onRequest(offset)}>
                <div className="inner">load more</div>
            </button>
        </div>
    )
}

// ComicsList.propTypes = {
//     onCharSelected: PropTypes.func.isRequired
// }

export default ComicsList;