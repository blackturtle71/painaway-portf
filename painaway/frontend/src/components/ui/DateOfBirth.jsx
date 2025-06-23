import { Form, Row, Col } from 'react-bootstrap'

const DateOfBirth = (props) => {
  const { values } = props
  const {
    formik,
    label,
    fields,
  } = values

  return (
    <Form.Group as={Row} className="mb-3 align-items-center">
      <Form.Label column sm={3} className="mb-0">
        {label}
      </Form.Label>
      <Col sm={9}>
        <Row>
          {fields.map(({ field, ariaLabel, range }) => (
            <Col key={field} xs={4}>
              <Form.Select
                name={field}
                aria-label={ariaLabel}
                value={formik.values[field]}
                onChange={formik.handleChange}
                isInvalid={formik.touched[field] && !!formik.errors[field]}
                size="sm"
              >
                <option value="">{ariaLabel}</option>
                {range.map(i => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </Form.Select>
              {formik.touched[field] && formik.errors[field] && (
                <Form.Control.Feedback type="invalid">
                  {formik.errors[field]}
                </Form.Control.Feedback>
              )}
            </Col>
          ))}
        </Row>
      </Col>
    </Form.Group>
  )
}

export default DateOfBirth
