import React, { Component } from 'react';
import { Form, Row, Col, FormGroup, FormControl, ControlLabel, Button } from 'react-bootstrap';

class QueryForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      query: '',
    };
  }

  componentWillReceiveProps(nextProps) {
    const { query } = nextProps;
    if (query) {
      this.setState({ query });
    }
  }

  handleSubmit() {
    const { onSubmit } = this.props;
    const { name, query } = this.state;
    this.setState({
      name: '',
      query: '',
    });
    onSubmit({ name, query });
  }

  get submitDisabled() {
    const { name, query } = this.state;
    return !name || !query;
  }

  render() {
    const { name, query } = this.state;

    return (
      <Form onSubmit={() => this.handleSubmit()}>
        <Row>
          <FormGroup>
            <Col xs={3}>
              <ControlLabel>Name</ControlLabel>
              <FormControl
                type="text"
                placeholder="Name.."
                value={name}
                defaultValue={name}
                onChange={(evt) => this.setState({ name: evt.target.value })}
              />
            </Col>

            <Col xs={9}>
              <ControlLabel>Query</ControlLabel>
              <FormControl
                type="text"
                placeholder="capi search query.."
                value={query}
                defaultValue={query}
                onChange={(evt) => this.setState({ query: evt.target.value })}
              />
            </Col>
          </FormGroup>
        </Row>
        <Row>
          <div className="help-block" />
          <Col xs={1} xsOffset={11}>
            <Button
              className="pull-right"
              bsStyle="success"
              disabled={this.submitDisabled}
              onClick={() => this.handleSubmit()}
            >
              Save
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default QueryForm;
