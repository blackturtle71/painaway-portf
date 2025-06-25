import { Form, Row, Col } from 'react-bootstrap'

const Gender = (props) => {
  const { values } = props
  const {
    formik,
    sex,
    genders,
  } = values

  return (
    <Form.Group as={Row} className="mb-3 align-items-center">
      <Form.Label column sm="3" className="mb-0">
        {sex}
      </Form.Label>
      <Col sm="9" className="d-flex gap-3">
        {genders.map((g) => {
          const value = g.id === 1 ? 'M' : 'F'
          return (
            <Form.Check
              inline
              key={g.id}
              type="radio"
              id={`gender-${g.id}`}
              label={g.gender}
              name="sex"
              value={value}
              checked={formik.values.sex === value}
              onChange={formik.handleChange}
              isInvalid={formik.touched.sex && !!formik.errors.sex}
            />
          )
        })}
      </Col>
    </Form.Group>
  )
}

export default Gender
