import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flushPromises, shallowMount } from '@vue/test-utils'
import axios from 'axios'
import KundenView from '../../views/KundenView.vue'

describe('KundenViewMitRestData', () => {
  beforeEach(() => {
    vi.mock('axios')
    vi.spyOn(window, 'confirm').mockImplementation(() => true)
  })

  it('info anzeigen, wenn Datenbank leer ist', async () => {
    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: [] })

    const wrapper = shallowMount(KundenView)
    await flushPromises()

    expect(wrapper.text()).toContain('Keine Kunden vorhanden')
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('Kundendaten vom Backend laden', async () => {
    const twoCustomersResponse = [
      { id: 1, name: 'Test Kunde 1', adresse: 'Teststraße 1', telefon: '123456', email: 'test1@test.de' },
      { id: 2, name: 'Test Kunde 2', adresse: 'Teststraße 2', telefon: '654321', email: 'test2@test.de' }
    ]

    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: twoCustomersResponse })

    const wrapper = shallowMount(KundenView)
    await flushPromises()

    expect(wrapper.find('table').exists()).toBeTruthy()
    expect(wrapper.findAll('tbody tr')).toHaveLength(twoCustomersResponse.length)
    expect(wrapper.text()).toContain('Test Kunde 1')
    expect(wrapper.text()).toContain('Teststraße 1')
  })

  it('API Errpr handeln', async () => {
    vi.mocked(axios, true).get.mockRejectedValueOnce(new Error('API Error'))

    const wrapper = shallowMount(KundenView)
    await flushPromises()

    expect(wrapper.text()).toContain('Keine Kunden vorhanden')
    expect(wrapper.find('table').exists()).toBe(false)
  })

  it('Kunden erfolgreich hinzufügen', async () => {
    const newCustomer = {
      name: 'Neuer Kunde',
      adresse: 'Neue Straße 1',
      telefon: '999999',
      email: 'neu@test.de'
    }

    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: [] })
    vi.mocked(axios, true).post.mockResolvedValueOnce({
      data: { id: 1, ...newCustomer }
    })

    const wrapper = shallowMount(KundenView)
    await flushPromises()


    await wrapper.find('.add-customer-btn').trigger('click')


    await wrapper.find('#customer-name').setValue(newCustomer.name)
    await wrapper.find('#customer-adresse').setValue(newCustomer.adresse)
    await wrapper.find('#customer-phone').setValue(newCustomer.telefon)
    await wrapper.find('#customer-email').setValue(newCustomer.email)


    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(axios.post).toHaveBeenCalledWith(expect.any(String), newCustomer)
  })

  it('Kunden erfolgreich bearbeiten', async () => {
    const existingCustomer = {
      id: 1,
      name: 'Alt Kunde',
      adresse: 'Alt Straße 1',
      telefon: '111111',
      email: 'alt@test.de'
    }

    const updatedCustomer = {
      name: 'Update Kunde',
      adresse: 'Update Straße 1',
      telefon: '222222',
      email: 'update@test.de'
    }

    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: [existingCustomer] })
    vi.mocked(axios, true).put.mockResolvedValueOnce({
      data: { id: 1, ...updatedCustomer }
    })

    const wrapper = shallowMount(KundenView)
    await flushPromises()


    await wrapper.find('.edit-btn').trigger('click')


    await wrapper.find('#edit-customer-name').setValue(updatedCustomer.name)
    await wrapper.find('#edit-customer-adresse').setValue(updatedCustomer.adresse)
    await wrapper.find('#edit-customer-phone').setValue(updatedCustomer.telefon)
    await wrapper.find('#edit-customer-email').setValue(updatedCustomer.email)


    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(axios.put).toHaveBeenCalledWith(
      expect.stringContaining('/1'),
      updatedCustomer
    )
  })

  it('Kunden erfolgreich löschen', async () => {
    const customer = {
      id: 1,
      name: 'Test Kunde',
      adresse: 'Test Straße',
      telefon: '123456',
      email: 'test@test.de'
    }

    vi.mocked(axios, true).get.mockResolvedValueOnce({ data: [customer] })
    vi.mocked(axios, true).delete.mockResolvedValueOnce({})

    const wrapper = shallowMount(KundenView)
    await flushPromises()


    await wrapper.find('.delete-btn').trigger('click')
    await flushPromises()

    expect(axios.delete).toHaveBeenCalledWith(expect.stringContaining('/1'))
  })
})
