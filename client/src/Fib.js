import React from 'react';

class Fib extends React.Component {
    state = {
        seenIndexes: [],
        values: {},
        index: '',
    };

    componentDidMount() {
        this.fetchValue();
        this.fetchIndexes();
    }

    async fetchValue() {
        //const values = await fetch('/api/values/current');
        const values = {1: 1, 2: 2}
        this.setState({
            values: values.data
        });
    }

    async fetchIndexes() {
        //const seenIndexes = await fetch('/api/values/all');
        const seenIndexes = {
            data: [
                { number: 1, value: 1},
                { number: 2, value: 2}
            ]
        }
        this.setState({
            seenIndexes: seenIndexes.data
        })
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        await fetch({
            method: 'POST',
            url: '/api/values',
            body: JSON.stringify({
                index: this.state.index
            })
        })

        this.setState({index: ''})
    }

    renderSeenIndexes() {
        return this.state.seenIndexes.map(({ number }) => number).join(', ');
    }

    renderValues() {
        const entries = [];

        for(let key in this.state.values) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated {this.state.values[{key}]}
                </div>
            )
        }

        return entries;
    }

    render() {
        return(
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter your index:</label>
                    <input
                        value={this.state.index}
                        onChange={event => this.setState({index: event.target.value})}
                    />
                    <button>Submit</button>
                </form>

                <h3>Indexes I have seen</h3>
                    {this.renderSeenIndexes()} 

                <h3>Calculated Values</h3>
                    {this.renderValues()}
            </div>
        )
    }
}

export default Fib;
