import React from 'react';
import './todo.css';

type listItemProps = {
    itemKey: number, 
    taskText: string, 
    onHandleRemoveClick: (MouseEvent) => void
}

export default class ToDoListItem extends React.Component< listItemProps, {  }> {
    constructor(props) {
        super(props);

        this.handleRemoveClick = this.handleRemoveClick.bind(this);
        this.handleListItemClick = this.handleListItemClick.bind(this);
    }

    handleListItemClick(event) {
        const target = event.currentTarget;
        target.classList.toggle('checked');
    }

    handleRemoveClick(event) {
        this.props.onHandleRemoveClick(event);
    }

    render() {
        return (
            <li id={this.props.itemKey.toString()} onClick={this.handleListItemClick}>
                {this.props.taskText} 
                <span className="close" onClick={this.handleRemoveClick} >x</span>
            </li>
        );
    }
}