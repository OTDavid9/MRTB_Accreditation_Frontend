"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";

import StepOne from "./StepOne";
import StepTwo from "./StepTwo"; 
import StepThree from "./StepThree"; 
import StepFour from "./StepFour";

// ==========================================
// HELPER TO GENERATE S/N & HEADERS
// ==========================================
const buildItemList = (list: string[]) => {
  let mainCounter = 0;
  return list.map(itemStr => {
    const isSub = itemStr.startsWith("- ");
    const isHeader = itemStr.endsWith(":");
    if (!isSub) mainCounter++;
    
    return {
      item: isSub ? itemStr.substring(2) : itemStr, 
      isSubItem: isSub,
      isHeader: isHeader,
      sn: isSub ? "•" : mainCounter, 
      isAvailable: '',
      availableQuantity: '',
      floorStructure: '' 
    };
  });
};

// ==========================================
// DATA LISTS 
// ==========================================
const expandedSpacesList = [
  "Offices", "Departmental Board Room / Seminar Room", "Lecture Halls / Lecture Theatre / Classrooms and Student Conveniences:", "- Lecture Halls / Lecture Theatre / Classrooms", "- Student Conveniences", "Hostel Accommodation with Conveniences", "Basic Medical Laboratories:", "- Gross Anatomy and Embryology", "- Histology", "- Museum", "- Biochemistry", "- Physiology", "Physiotherapy demonstration laboratories:", "- Exercise Therapy / Gymnasium", "- Electrotherapy", "- Hydrotherapy", "- Simulation", "- Human Movement Laboratory", "Library:", "- College / Departmental", "- Institutional", "- E-library", "Transportation", "Alternative power source (Solar, Generator)", "Running water supply", "Safety Equipment across facility"
];

const expandedClinicalList = [
  "Hospital Bed Space", "Specialist Services:", "- Paediatrics", "- Obstetrics and Gynaecology", "- Neurology", "- Cardiology", "- Endocrinology", "- General Surgery", "- Orthopaedics", "- ICU/ Anaesthesia", "- Trauma", "- Oncology", "- Mental Health etc.", "Physiotherapy Department:", "- Purpose Built", "- Number of Physiotherapists", "Areas of specialization:", "- Paediatrics", "- Neurology", "- Orthopaedics", "- Pelvic, Obstetrics and Gynaecology", "- Cardiopulmonary", "- Geriatrics", "- Community & Palliative care", "- Mental Health", "- Ergonomics/Occupational Health", "- Sports and Recreational", "Academic Physiotherapy Department:", "- Purpose Built", "- Within Hospital Premises", "Clinical Students Hostel:", "- Within Hospital Premises", "- Well Furnished/Poorly Furnished", "- Water Supply", "- Convenience", "- Gender Sensitivity", "- Disability Friendly", "Funding Source - Clearly Stated"
];

const anatomyList = ["Embalmed Bodies", "Anatomage Table", "Equipment Trolleys", "Electric Embalming Machine", "Bone Cutting Equipment - Electric Saw/Drill", "Articulated and Unarticulated Skeletons", "X-ray Viewing Boxes", "Air-conditioners and Air Extractors", "Models", "Slide for Sections", "Slide Projectors", "Toilet Facilities:", "- Male", "- Female", "Changing Room", "Shower Room"];
const histologyList = ["Microtome", "Rotary/Sledge Microtome Knives", "Light Microscopes Microtome", "Vacuum Pump Dissecting Microtome", "Cryostat with Microtome", "Teaching Microscope", "Electron Microscope", "Slides"];
const biochemistryList = ["Centrifuge", "Ultracentrifuge", "Electronic Balances", "Heating Block", "Vacuum Pumps", "Spectrophotometer", "PH. Metres", "Thermostatic Water Bath", "Burner", "Test Tube (varying sizes)", "Distiller"];
const physiologyList = ["Spirometer", "Vitalograph", "Polygraph", "Peak Flow Metre", "Gas Metre", "ECG Machine", "Spectrophotometers", "Physiograph Recorder Transducers", "Oscilloscopes", "Centrifuges", "Blood Gas Callipers", "Audiometer", "Water Baths", "Electronic Weighing Balance Scale", "Flame Photometer", "Microcentrifuge", "Water Distiller", "Bicycle Ergometer", "Stethoscopes/Sphygmomanometres", "Electron Microscope", "Teaching Microscope", "Slides", "Snelle's Chart"];
const exerciseTherapyList = ["Multi Gym", "Treadmill", "Bicycle Ergometer", "Elliptical Bicycle Ergometer", "Recumbent Bicycle Ergometer", "Hand Exerciser", "Shoulder Wheel", "Shoulder Ladder", "Quadriceps Drill/Bench", "Traction Units (cervical/lumbar)", "Medicine Ball (5 varying weights)", "Exercise Ball", "Reciprocal Pulley", "Steppers", "Wooden Staircase (firm/shakeable)", "Wobble Board", "Parallel Bar", "Standing Mirror", "Exercise Mat", "Sitting Box", "Standing Box", "TheraBands:", "- Yellow", "- Green", "- Blue", "- Red", "Handgrip Exerciser", "Dumbbells (1, 2, 3, 4, 5kgs)", "Sand Bags (1, 2, 3, 4, 5kgs)", "Walking Frames", "Suspension Therapy Unit", "Crutches (Elbow and Axillary)", "Wheel Chairs", "Weighing Scale", "Stadiometer", "Pulse Oximeter", "Tape Measure", "Sphygmomanometer", "Stethoscope", "Walking Sticks, Quadruped & Tripod", "Precision Box", "X-ray Viewing Box", "Exercise Couch", "Makintosh", "Pillows", "Bedsheet", "Finger Ladder"];
const electrotherapyList = ["TENS Machine", "EMS Machine", "IRR Luminous", "IRR Non-luminous", "Shortwave Diathermy", "Wax Bath", "UVR", "IF Therapy", "Shock Wave", "Micro Wave", "Ice Making Machine", "Therapeutic Ultrasound", "Laser or Light Therapy", "Hydrocollator Unit", "Pneumatic Machine"];
const hydrotherapyList = ["Standard Hydrotherapy Pool", "Aquatic Ergometer", "Aquatic Treadmill", "Life Jacket"];
const simulationLabList = ["High Impedance Mannequin", "Mannequins and Beds in the Laboratory:", "- Manual Mannequins", "- Beds"];
const diagnosticList = ["Goniometers", "Sphygmomanometer / Stethoscope", "Spirometers", "Peak Flow Meters", "Skin Fold Callipers", "One Stop Watch", "Hand Grip Dynamometer /Digital Dynamo", "Scale Weight (wheelchair accessible)", "Pain Rating Scale", "X-ray Viewing Box", "Sensory Processing Test Equipment", "Heart Rate Monitor", "Measuring Tape", "Cognitive Test Equipment", "Stadiometer", "EMG", "Body Mass Index Calculator", "Pulse Oximeter", "Reflex Hammer", "Tongue Depressor (Pack)", "Tuning Fork (128Hz)", "Two Test Tubes", "Familiar Objects (e.g. paper clip, coin, marble)", "Pen Light", "Thermometer", "Cotton Ball or Cotton Tipped Swab (Pack)", "Pexinometer"];
const infectionControlList = ["Face Masks (Pack)", "Disposable Gloves (Pack)", "Sputum Containers (Pack)", "Sterilizing Unit", "Autoclave", "Antiseptic Solution (Pack)", "Washing Machine", "Drying Machine"];
const paediatricList = ["Gait Trainers", "Precision Boxes", "Precision Toys", "Giant Mirrors", "Prone Standers", "Standing Frames", "treatment Plinths", "Therapy Balls/Medicine Balls", "Posterior Walkers", "Wedges and Rolls", "Frenkel Mats", "Paediatric Treadmill", "Resistance Bands", "Paediatric Crutches", "Paediatric Tilt Bed", "Supportive Garment", "Stabilization Belts", "Everyday Objects for ADL", "Exercise Mats", "Adapted Eating and Drinking Products"];
const neurologyList = ["Suctioning Machine", "Tilt Bed", "TheraBand - Resistance Band (Yellow, Green, Blue, Red)", "Neuro-com Balance Master", "Wheelchair - Motorised", "Walking Sticks", "3 by 4 Wheeled Walker", "Precision Box", "Gait Belts", "Pulse Oximeter", "Wall Bar", "Standing Infra-red Lamp (luminous/non-luminous)", "Metronome", "Spit Basin", "Flashlight", "Cognitive Test Equipment (PD & dementia)", "Transfer Boards/Slide Sheet", "Pillows", "Foam Rollers/Wedges", "Splinting Kit (static/dynamic)", "Orthoses Kit", "Casting Kit", "Rollator", "Equipment for Sport and Recreational Activities", "Upper Limb Supports", "Upper Limb Workstation", "Arm Activity Kit", "Cycle Ergometer (arm or leg)", "Stools/Small Benches of varying Height", "Ramps (temporary/mobile)", "Training Stairs", "Parallel Bar", "Steps (stackable)", "Balance Board/Cushion", "Resistive Exercise Putty", "Exercise or Gym Balls", "TENS Supply Kit", "Treatment Tables", "(Functional) Electrical Stimulation Kit", "Assistant Support Belt", "Transfer Boards/Slide Sheet", "Weighing Scale & Measuring Tape", "Heart Rate Monitor", "Cycle Ergometer (Arm & Leg)", "Exercise Mats", "Timer", "Body Mass Index Calculator", "Frenkel Mat", "Paediatric Treadmill", "Shoulder Wheel", "Finger Ladder", "Reciprocal Pulley"];
const orthopaedicsList = ["Lumber & Cervical Traction Bed", "Bicycle Ergometer", "Treadmill Machine", "Tilt Bed", "Parallel Bar", "Precision Board", "Dumbbells:", "- 1kg", "- 2kg", "- 3kg", "- 4kg", "- 5kg", "- 10kg", "Gait Belt", "Tera Bands", "Hand Exerciser Balls", "Wall Bar", "Shoulder Wheel", "Wooden Staircase", "Pulse Oximeter", "Wax Bath Machine", "Short Wave Diathermy Machine", "Interferential Current Machine", "Transcutaneous Electrical Muscle Stimulator", "Electrical Muscle Stimulator", "Standing Infrared Machine (luminous/nonluminous)", "Ice Making Machine", "Ultraviolent Machine", "Multi Gym", "Wobble Board", "Exercise Mats", "X-ray Viewing Machine", "Steppers", "Reciprocal Pulley", "Therapeutic Ultra Sound Machine", "Orthoses Kit", "Splinting Kit (static/dynamic)", "Balance Board/Cushion", "Training Stairs", "Transfer Boards/Slide Sheet", "Steps (stackable)", "Ramps (temporary/mobile)", "Upper Limb Workstation", "Resistive Exercise Putty", "Stabilization/Mobilization Belts", "Casting Kit", "Walking Frames/W", "Rollators", "Crutches, Axillary/Elbow", "Canes/Sticks/Tetrapod", "Hot and Cold Packs"];
const pelvicHealthList = ["Vaginal Cones (diff sizes)", "Exercise Mats", "Small and Large Exercise Balls", "Dumbbells of different sizes", "Bicycle Ergometer", "Treadmill", "Screen", "Electrical Muscle Stimulator", "Portable TENS", "Pedometer", "Weighing Scale", "Stethoscope", "Sphygmomanometer", "Tape Measure", "Stadiometer", "Ultrasound Imaging", "Vaginal and anal Sensors", "Vaginal Weight", "Pulse Oximeter", "Pelvic Models (male and female)", "Tubi Grip", "Pelvic Belts / SPD belts", "Educational booklets on treatment/ HEP (handouts to patients)", "Irrigation Therapy Devices:", "- Peristeen Irrigation system", "- Aquaflush compact system", "- Qufora irrigation", "- Navina Irrigation system", "Pessaries - require trained therapist for fitting", "Intravaginal Devices for Stress Urinary Incontinence:", "- Contiform", "- Contrelke", "- Efemia", "- Revive", "Cryotherapy in the form of ice fingers (made using examination gloves)", "Foam Wedge", "Biofeedback Machine", "Vibrators (Patient acquired-personalized)", "Pelvic Wand", "Kegel Balls", "Dilators (Patient acquired-personalized)", "Surface Electrodes", "Lubricating Gel", "Vaginal balls for Kegel exercises"];
const cardioPulmonaryList = ["Modern Mechanical Vibrators", "ECG Cycle Ergometers", "ECG Treadmills", "ECG Device", "Dynamometers", "High Frequency Chest Wall Oscillation (HFCWO) Device", "High Frequency Chest Compression Machine", "Nimbus Series Bed at least 1", "Positive Expiratory Pressure (PEP) Mask with Manometer", "Electro Flo 5000 Airway Clearance Device", "Chest Vibrator", "Children CompAir Lightweight Compressor Respiratory Nebulizer Inhale", "Lumbar Vibratory Massage Pillow", "Apex Exercise Pulley Set", "Handycare Rollator", "Mini Electric Exercise Bike", "Mobile Frame Gait Walker", "Fourier Intelligence Robot", "Exercise Stair & Steps", "Electronic Nebulizers", "Peak Flow Meter", "Respiratory Exerciser", "Pulse Oximeter", "Ambu Bag", "Suctioning Machine", "Heart Monitor", "ECG Machine", "Non-invasive Ventilators", "Spirometers", "In-sufflators Device", "Ex-sufflators Device"];
const geriatricList = ["Electrical Muscle Stimulators", "Stethoscope", "Sphygmomanometer", "Exercise Mats", "Reciprocal Pulley", "TheraBand (yellow, red, blue, black)", "Therapeutic Ultrasound Machine", "Sand Bag 3kg, 2kg, 1kg", "Transcutaneous Electrical Nerve Stimulator", "Plinths", "Bicycle Ergometer", "Shortwave Diathermy", "Wall Bars", "Finger Ladder", "Shoulder Wheel", "Standing Mirror", "Hand Function Board", "Hand Balls/Hand Exercisers", "Wooden Stair Case", "Wobble Board", "Gait Belts", "Steppers", "Parallel Bars", "Standing Infrared Machine"];
const communityBasedList = ["Portable Ultrasonic Therapy Machine", "TENS/EMS", "Infra-Red Lamps", "Freezer (small size) for Ice making", "Parallel Bar", "Walking Aids (axillary crutches, elbow crutches, walking frame, tetrapod stick, tripod stick)", "Exercise Mats", "Weights/Sand bags", "Lumbar and Cervical Traction Kits", "Wooden Staircase", "Hand Exercisers", "Wobble Boards", "Wall Bar", "Pulse Oximeter", "Stethoscope", "Sphygmomanometer", "Shoulder Wheel", "Bandages", "Gait Belts", "Frenkel Mats", "Plinths", "Giant Standing Mirrors"];
const palliativeCareList = ["TENS", "Hot and Cold Packs", "Foam Wedges", "Foam Rollers", "Utensils for Activities of Daily Living", "Balance Board/Cushion", "Resistance Bands", "Weights", "Exercise Ball", "Assistive Products for Dressing", "Assistive Products for Toileting", "Adapted Eating and Drinking Products", "Equipment for Sport and Recreational Activities", "Steppers"];
const mentalHealthList = ["Balance Board/Cushion", "Cycle Ergometer (arm or leg)", "Resistance Bands", "Utensils for Activities of Daily Living", "Video Recording Devices", "Dumbbells of Varying Sizes", "Giant Mirror"];
const ergonomicsList = ["Portable Ultrasonic Therapy Machine", "TENS/EMS", "Standing Infra-Red Lamps", "Freezer (small size) for Ice making", "Parallel Bar", "Walking Aids (crutches)", "Exercise Mats", "Weights/Sand Bags", "Cervical Traction Machine", "Wooden Staircase", "Hand Exercisers", "Wobble Boards", "Wall Bar", "Pulse Oximeter", "Stethoscope", "Sphygmomanometer", "Shoulder Wheel", "Bandages", "Gait Belts"];
const sportsList = ["Goniometer", "Measuring Tape", "Hand Dynamometer", "Reflex Hammer/Patella Hammer", "Resistance Bands", "Dumbbells", "TENS", "Therapeutic Ultrasound", "Ice Packs/Cryotherapy Cuffs", "Treadmill", "Braces/Splints", "Kinesiotapes"];
const safetyMeasuresList = ["Alarm", "Fire Extinguisher", "Blanket", "Intercom", "Fire Assembly Point", "Sand Bucket", "Clearly marked direction to muster point"];

export default function PhysioAcademicAssessment() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);

  // GLOBAL FORM STATE
  const [formData, setFormData] = useState({
    stepOne: {
      lecturers: [{ id: 'lec_1', name: '', gender: '', dateAppt: '', natureAppt: '', designation: '', license: '', qualifications: [{ id: 'q_1', title: '', date: '' }], cpds: [{ id: 'c_1', title: '' }] }],
      supportStaff: [{ id: 'sup_1', name: '', gender: '', rank: '', trainingFileName: '', jobDescription: '', qualifications: [{ id: 'sq_1', title: '', date: '' }] }]
    },
    stepTwo: { spaces: buildItemList(expandedSpacesList) },
    stepThree: { clinicalTraining: buildItemList(expandedClinicalList) },
    stepFour: {
      anatomy: buildItemList(anatomyList),
      histology: buildItemList(histologyList),
      biochemistry: buildItemList(biochemistryList),
      physiology: buildItemList(physiologyList),
      exerciseTherapy: buildItemList(exerciseTherapyList),
      electrotherapy: buildItemList(electrotherapyList),
      hydrotherapy: buildItemList(hydrotherapyList),
      simulationLab: buildItemList(simulationLabList),
      diagnostic: buildItemList(diagnosticList),
      infectionControl: buildItemList(infectionControlList),
      paediatric: buildItemList(paediatricList),
      neurology: buildItemList(neurologyList),
      orthopaedics: buildItemList(orthopaedicsList),
      pelvicHealth: buildItemList(pelvicHealthList),
      cardioPulmonary: buildItemList(cardioPulmonaryList),
      geriatric: buildItemList(geriatricList),
      communityBased: buildItemList(communityBasedList),
      palliativeCare: buildItemList(palliativeCareList),
      mentalHealth: buildItemList(mentalHealthList),
      ergonomics: buildItemList(ergonomicsList),
      sports: buildItemList(sportsList),
      safetyMeasures: buildItemList(safetyMeasuresList)
    }
  });

  const handleNext = () => { if (currentStep < totalSteps) { setCurrentStep(currentStep + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const handlePrev = () => { if (currentStep > 1) { setCurrentStep(currentStep - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };

  const updateEquipmentCategory = (categoryKey: string, index: number, field: string, value: any) => {
    const updatedCategory = [...(formData.stepFour as any)[categoryKey]];
    updatedCategory[index] = { ...updatedCategory[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      stepFour: { ...prev.stepFour, [categoryKey]: updatedCategory }
    }));
  };

  // --- VALIDATION ENGINE ---
  const checkIncompleteFields = () => {
    const allEq = Object.values(formData.stepFour).flat();
    const allItems = [...formData.stepTwo.spaces, ...formData.stepThree.clinicalTraining, ...allEq];
    return allItems.some((item: any) => !item.isHeader && (item.isAvailable === '' || (item.isAvailable === 'Yes' && item.availableQuantity === '')));
  };

  const handleInitialSubmit = () => {
    if (checkIncompleteFields()) setShowIncompleteWarning(true);
    else executeSubmit();
  };

  const executeSubmit = async () => {
    setShowIncompleteWarning(false);
    setIsSubmitting(true);
    
    const formatList = (list: any[]) => list.map(item => ({
      ...item,
      isAvailable: item.isHeader ? 'Header' : (item.isAvailable === '' ? '-' : item.isAvailable),
      availableQuantity: item.isHeader ? 'Header' : ((item.isAvailable === 'Yes' && item.availableQuantity === '') ? '-' : item.availableQuantity)
    }));

    const allEquipmentRaw = Object.values(formData.stepFour).flat();

    const payload = { 
        lecturers: formData.stepOne.lecturers, 
        supportStaff: formData.stepOne.supportStaff,
        spaces: formatList(formData.stepTwo.spaces), 
        clinicalTraining: formatList(formData.stepThree.clinicalTraining),
        equipment: formatList(allEquipmentRaw),
        assessment_type: "physiotherapy_academic" 
    };

    const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/entity/assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'ngrok-skip-browser-warning': 'true' },
        body: JSON.stringify(payload)
      });
      if (response.ok) setIsSuccessModalOpen(true);
      else alert("Submission failed. Please try again.");
    } catch (error) {
      console.error("Submission Error:", error);
      alert("Network error during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans text-slate-800 pb-20 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0 opacity-[0.03]" style={{ backgroundImage: "url('/logo.png')", backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '500px' }} />

      {isSubmitting && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
          <Loader2 size={48} className="animate-spin text-[#65A30D] mb-4" />
          <p className="text-gray-800 font-bold text-lg">Submitting Assessment...</p>
        </div>
      )}

      <header className="bg-white border-b border-gray-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-40 shadow-sm relative">
        <div className="flex-1">
          <button onClick={currentStep === 1 ? undefined : handlePrev} className="p-2 hover:bg-slate-50 rounded-full transition-colors inline-flex">
            {currentStep === 1 ? <Link href="/dashboard"><ArrowLeft size={20} className="text-[#066936]" /></Link> : <ArrowLeft size={20} className="text-[#066936]" />}
          </button>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center">
          <img src="/logo.png" alt="Logo" className="object-contain w-full h-full" />
        </div>
        <div className="flex-1 flex justify-end">
          <div className="bg-[#F8FCF5] px-4 py-2 rounded-md hidden md:block w-max border border-[#CDE1B4]/50 shadow-sm">
            <p className="text-[11px] text-gray-500 font-medium"><span className="text-[#066936] font-bold">Step {currentStep} of {totalSteps}</span></p>
            <p className="text-[10px] text-[#5D9C0E] font-bold mt-0.5 uppercase tracking-wider">Physiotherapy - Academics</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto pt-10 px-4 md:px-0 relative z-10">
        {currentStep === 1 && <StepOne data={formData.stepOne} updateData={(d: any) => setFormData({ ...formData, stepOne: d })} onNext={handleNext} />}
        {currentStep === 2 && <StepTwo data={formData.stepTwo} updateData={(d: any) => setFormData({ ...formData, stepTwo: d })} onNext={handleNext} onPrev={handlePrev} />}
        {currentStep === 3 && <StepThree data={formData.stepThree} updateData={(d: any) => setFormData({ ...formData, stepThree: d })} onNext={handleNext} onPrev={handlePrev} />}
        {currentStep === 4 && <StepFour data={formData.stepFour} updateCategory={updateEquipmentCategory} onPrev={handlePrev} onSubmit={handleInitialSubmit} isSubmitting={isSubmitting} />}
      </main>

      {/* SMARTER & SMALLER WARNING MODAL */}
      {showIncompleteWarning && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/60 backdrop-blur-[1px] px-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[20px] shadow-2xl px-6 py-6 w-full max-w-[340px] flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="bg-[#EEF6DF] p-3 rounded-full mb-3 shadow-sm border border-[#CDE1B4]/50">
                <AlertTriangle size={28} className="text-[#5D9C0E]" strokeWidth={2.5} />
            </div>
            <h2 className="text-[17px] font-bold text-gray-900 mb-2">Incomplete Form</h2>
            <p className="text-gray-500 font-medium text-[13px] mb-6 leading-relaxed">
              You have unanswered fields. Please note that submitting an incomplete assessment may negatively impact your accreditation approval.
            </p>
            <div className="flex flex-col w-full gap-2.5">
              <button onClick={() => setShowIncompleteWarning(false)} className="w-full bg-[#066936] hover:bg-[#044c27] text-white font-bold py-2.5 rounded-full transition-all shadow-md text-[13px]">
                Review & Complete
              </button>
              <button onClick={executeSubmit} className="w-full border border-gray-200 text-gray-500 font-bold py-2.5 rounded-full hover:bg-gray-50 transition-all text-[13px]">
                Submit Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-[1px] px-4">
          <div className="bg-white rounded-[20px] shadow-2xl px-6 py-6 w-full max-w-[340px] flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            <div className="bg-[#38A169] p-2 rounded-xl rotate-45 mb-3">
              <div className="-rotate-45"><CheckCircle2 size={24} className="text-white" strokeWidth={3} /></div>
            </div>
            <p className="text-[#38A169] font-medium text-[13px] mb-5">Assessment form submitted successfully!</p>
            <button onClick={() => router.push('/dashboard')} className="border border-[#38A169] text-[#38A169] w-full py-2.5 rounded-full font-medium text-[13px] hover:bg-[#F4F9F2] transition-colors">
              Back to dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
