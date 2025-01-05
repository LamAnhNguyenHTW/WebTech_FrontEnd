import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import axios from 'axios'
import ProductManagement from '../../views/ProduktView.vue'

describe('ProductManagement', () => {
  beforeEach(() => {
    vi.mock('axios')
  })

  it('Produktliste laden', async () => {
    const products = [
      { id: 1, name: 'Product 1', price: 10.0, quantity: 5 },
      { id: 2, name: 'Product 2', price: 20.0, quantity: 3 }
    ]
    vi.mocked(axios.get).mockResolvedValueOnce({ data: products })

    const wrapper = mount(ProductManagement)
    await flushPromises()


    expect(wrapper.findAll('tbody tr')).toHaveLength(products.length)
    expect(wrapper.text()).toContain('Product 1')
    expect(wrapper.text()).toContain('Product 2')
  })

  it('Info anzeigen, wenn Datenbank leer ist', async () => {
    vi.mocked(axios.get).mockResolvedValueOnce({ data: [] })

    const wrapper = mount(ProductManagement)
    await flushPromises()

    expect(wrapper.text()).toContain('Keine Produkte hinzugefügt.')
  })

  it('Produkte hinzufügen', async () => {
    const newProduct = { name: 'New Product', price: 30.0, quantity: 10 }

    vi.mocked(axios.post).mockResolvedValueOnce({ data: { id: 3, ...newProduct } })
    vi.mocked(axios.get).mockResolvedValueOnce({ data: [] })

    const wrapper = mount(ProductManagement)
    await flushPromises()


    await wrapper.find('.add-product-btn').trigger('click')


    await wrapper.find('#product-name').setValue(newProduct.name)
    await wrapper.find('#product-price').setValue(newProduct.price)
    await wrapper.find('#product-quantity').setValue(newProduct.quantity)


    await wrapper.find('form').trigger('submit')
    await flushPromises()


    expect(axios.post).toHaveBeenCalledWith(expect.any(String), newProduct)


    expect(wrapper.findAll('tbody tr')).toHaveLength(1)  // Assuming it's the first product
    expect(wrapper.text()).toContain(newProduct.name)
  })

  it('Produkt bearbeiten', async () => {
    const product = { id: 1, name: 'Product 1', price: 10.0, quantity: 5 }
    const updatedProduct = { name: 'Updated Product', price: 15.0, quantity: 7 }

    vi.mocked(axios.get).mockResolvedValueOnce({ data: [product] })
    vi.mocked(axios.put).mockResolvedValueOnce({ data: { id: 1, ...updatedProduct } })

    const wrapper = mount(ProductManagement)
    await flushPromises()


    await wrapper.find('.edit-btn').trigger('click')

    await wrapper.find('#edit-product-name').setValue(updatedProduct.name)
    await wrapper.find('#edit-product-price').setValue(updatedProduct.price)
    await wrapper.find('#edit-product-quantity').setValue(updatedProduct.quantity)

    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(axios.put).toHaveBeenCalledWith(expect.stringContaining('/1'), updatedProduct)

    expect(wrapper.text()).toContain(updatedProduct.name)
  })
})
