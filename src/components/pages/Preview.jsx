import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Document, Page, Text, View, StyleSheet, pdf, Font, PDFViewer } from '@react-pdf/renderer';

// Register Arial font
Font.register({
  family: 'Arial',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.36/fonts/arial.ttf',
});

// PDF Styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 20,
    fontFamily: 'Times-Roman',
  },
  content: (layout) => ({
    flexDirection: layout === 'horizontal' ? 'row' : 'column',
    flexWrap: 'wrap',
    justifyContent: layout === 'horizontal' ? 'space-between' : 'flex-start',
  }),
  questionSection: {
    marginBottom: 10,
    width: '48%',
  },
  questionText: {
    fontSize: 12,
    marginBottom: 5,
  },
  option: {
    fontSize: 10,
    marginBottom: 3,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 10,
    borderTop: '1pt solid #000',
    paddingTop: 10,
  },
});

// PDF Document Component
const PDFDocument = ({ questions, layout, showAnswers, formData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={{ marginBottom: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', textAlign: 'center' }}>
          {formData.schoolName}
        </Text>
        <Text style={{ fontSize: 12, textAlign: 'center' }}>Subject: {formData.subject}</Text>
        <Text style={{ fontSize: 12, textAlign: 'center' }}>Date: {formData.date}</Text>
      </View>

      {/* Questions */}
      <View style={styles.content(layout)}>
        {questions.map((question, index) => (
          <View key={question.id} style={styles.questionSection}>
            <Text style={styles.questionText}>
              {index + 1}. {question.text}
            </Text>
            {question.options &&
              question.options.map((opt, i) => (
                <Text key={i} style={styles.option}>
                  {String.fromCharCode(65 + i)}) {opt}
                </Text>
              ))}
            {showAnswers && (
              <Text style={{ fontSize: 10, color: 'green' }}>
                Answer: {question.answer}
              </Text>
            )}
          </View>
        ))}
      </View>

      <Text style={styles.footer}>End of Page</Text>
    </Page>
  </Document>
);

// Preview Component
const Preview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedQuestions = [] } = location.state || {};

  const [layout, setLayout] = useState('vertical');
  const [formData, setFormData] = useState({
    schoolName: '',
    subject: '',
    date: '',
    watermark: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleExportPDFs = async () => {
    const questionOnlyBlob = await pdf(
      <PDFDocument
        questions={selectedQuestions}
        layout={layout}
        showAnswers={false}
        formData={formData}
      />
    ).toBlob();

    const withAnswersBlob = await pdf(
      <PDFDocument
        questions={selectedQuestions}
        layout={layout}
        showAnswers={true}
        formData={formData}
      />
    ).toBlob();

    const downloadPDF = (blob, filename) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    };

    downloadPDF(questionOnlyBlob, 'questions_only.pdf');
    downloadPDF(withAnswersBlob, 'questions_with_answers.pdf');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:py-12 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Preview Questions</h1>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 gap-4 mb-4">
          <input
            type="text"
            name="schoolName"
            placeholder="School Name"
            value={formData.schoolName}
            onChange={handleInputChange}
            className="p-3 border rounded-md"
          />
          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleInputChange}
            className="p-3 border rounded-md"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="p-3 border rounded-md"
          />
          <input
            type="text"
            name="watermark"
            placeholder="Watermark"
            value={formData.watermark}
            onChange={handleInputChange}
            className="p-3 border rounded-md"
          />
        </div>

        {/* Layout Selection */}
        <div className="my-4">
          <label className="mr-4">
            <input
              type="radio"
              name="layout"
              value="vertical"
              checked={layout === 'vertical'}
              onChange={() => setLayout('vertical')}
            />
            Vertical Layout
          </label>
          <label className="ml-4">
            <input
              type="radio"
              name="layout"
              value="horizontal"
              checked={layout === 'horizontal'}
              onChange={() => setLayout('horizontal')}
            />
            Horizontal Layout
          </label>
        </div>

        {/* PDF Viewers */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <h2 className="text-center font-semibold py-2">Questions Only</h2>
            <PDFViewer width="100%" height="400px" showToolbar={false}>
              <PDFDocument
                questions={selectedQuestions}
                layout={layout}
                showAnswers={false}
                formData={formData}
              />
            </PDFViewer>
          </div>

          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <h2 className="text-center font-semibold py-2">Questions with Answers</h2>
            <PDFViewer width="100%" height="400px" showToolbar={false}>
              <PDFDocument
                questions={selectedQuestions}
                layout={layout}
                showAnswers={true}
                formData={formData}
              />
            </PDFViewer>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportPDFs}
          className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-md"
        >
          Export PDFs
        </button>
      </div>
    </div>
  );
};

export default Preview;
