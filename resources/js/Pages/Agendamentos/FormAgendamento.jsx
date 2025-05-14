                    <AutocompleteMultiple
                        label="Participantes"
                        options={usuarios}
                        value={formData.participantes}
                        onChange={(newValue) => setFormData(prev => ({ ...prev, participantes: newValue }))}
                        error={!!errors.participantes}
                        helperText={errors.participantes}
                    /> 