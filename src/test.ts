import { expect } from 'chai'
import fixedstr from './'

describe('fixedstr', () => {
  const transformer = new fixedstr([
    fixedstr.str('foo', 2),
    {
      name: 'bar',
      size: 5,
      parse: str => str
    },
    fixedstr.number('baz', 3)
  ])

  it('should objectify', () => {
    expect(transformer.objectify('F Bar  3')).to.eql({
      foo: 'F',
      bar: 'Bar  ',
      baz: 3
    })
  })

  it('should objectify empty string', () => {
    expect(transformer.objectify('')).to.eql({
      foo: '',
      bar: '',
      baz: 0
    })
  })

  it('should objectify empty undefined', () => {
    expect(transformer.objectify()).to.eql({
      foo: '',
      bar: '',
      baz: 0
    })
  })

  it('should stringify', () => {
    expect(
      transformer.stringify({
        foo: 'F',
        bar: 'Bar',
        baz: 3
      })
    ).to.equal('F Bar  003')
  })

  it('should stringify missing fields', () => {
    expect(
      transformer.stringify({
        foo: 'F'
      })
    ).to.equal('F      000')
  })

  it('should throw truncation error on string type', () => {
    let ex
    try {
      transformer.stringify({
        foo: 'Fooo'
      })
    } catch (e) {
      ex = e
    }
    expect(ex.message).to.contain('truncation error on field: foo')
  })

  it('should throw truncation error on number type', () => {
    let ex
    try {
      transformer.stringify({
        baz: 12345
      })
    } catch (e) {
      ex = e
    }
    expect(ex.message).to.contain('truncation error on field: baz')
  })

  it('should not throw truncation error if toFixedString truncated the value', () => {
    const t = new fixedstr([
      {
        name: 'foo',
        size: 4,
        toFixedString: (_, value) => {
          return value.substr(0, 4)
        }
      }
    ])
    const str = t.stringify({
      foo: '123456'
    })
    expect(str).to.equal('1234')
  })

  it('should not throw truncation error if using fixedstr.strTrunc', () => {
    const t = new fixedstr([fixedstr.strTrunc('TEST', 5)])
    const str = t.stringify({
      TEST: '123456'
    })
    expect(str).to.equal('12345')
  })
})
